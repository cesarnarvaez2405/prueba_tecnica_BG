import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_BUCKET_NAME;
const API_URL = process.env.API_URL;

const DATE_PATTERNS = {
  AAAAMMDD: /(\d{8})/,
};

function globToRegex(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const regexStr = '^' + escaped.replace(/\*/g, '.*') + '$';
  return new RegExp(regexStr);
}

function extractDate(fileName, dateFormat) {
  const pattern = DATE_PATTERNS[dateFormat];
  if (!pattern) return null;
  const match = fileName.match(pattern);
  return match ? match[1] : null;
}

function getExtension(fileName) {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex !== -1 ? fileName.substring(dotIndex) : '';
}

export const handler = async (event) => {
  for (const record of event.Records) {
    const { batchId, fileKeys, rules } = JSON.parse(record.body);
    const sortedRules = rules.filter((r) => r.isActive).sort((a, b) => a.priority - b.priority);
    const resultados = [];

    for (const fileKey of fileKeys) {
      try {
        const extension = getExtension(fileKey);
        const fileNameWithoutExt = fileKey.replace(extension, '');
        let matchedRule = null;

        for (const rule of sortedRules) {
          const regex = globToRegex(rule.pattern);
          if (regex.test(fileNameWithoutExt)) {
            matchedRule = rule;
            break;
          }
        }

        if (!matchedRule) {
          resultados.push({ archivoOrigen: fileKey, estado: 'NO_MAPEADO' });
          continue;
        }

        const date = extractDate(fileNameWithoutExt, matchedRule.dateFormat);
        const nombreTransformado = date
          ? `${matchedRule.outTemplate}_${date}${extension}`
          : `${matchedRule.outTemplate}${extension}`;

        await s3Client.send(
          new CopyObjectCommand({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${fileKey}`,
            Key: nombreTransformado,
          }),
        );

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: fileKey,
          }),
        );

        resultados.push({
          archivoOrigen: fileKey,
          nombreTransformado,
          estado: 'TRANSFORMADO',
          ruleId: matchedRule.id,
        });
      } catch (error) {
        resultados.push({
          archivoOrigen: fileKey,
          estado: 'ERROR',
          errorMessage: error.message,
        });
      }
    }

    await fetch(`${API_URL}/prueba-tecnica-bg/server/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId, resultados }),
    });
  }

  return { statusCode: 200 };
};
