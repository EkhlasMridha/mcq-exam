export interface ApiResponseType<T> {
  data: T;
  message: string;
  status: number;
}
export interface ControlProps {
  isError?: boolean;
}

declare module "react" {
  function forwardRef<T, P extends object>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
