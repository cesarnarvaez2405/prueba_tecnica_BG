export type ResponseService = {
  error: dataDatails;
};

export type dataDatails = {
  Data?: null;
  isSuccess?: boolean;
  message?: string;
  Errors: ErrorsDetails;
};

export interface ErrorsDetails {
  Details?: null;
  StatusCode: number;
  Message: string;
}
