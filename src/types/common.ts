export interface ApiResponseType<T> {
  data: T;
  message: string;
  status: number;
}
export interface ControlProps {
  isError?: boolean;
}
