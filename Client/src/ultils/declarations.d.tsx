declare module "sweetalert2-react-content" {
  import swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
  import { ReactNode } from "react";

  function withReactContent(swalInstance: typeof swal): {
    fire: (options: SweetAlertOptions & { didOpen?: (element: HTMLElement) => void }) => Promise<SweetAlertResult>;
  };

  export default withReactContent;
}
