import { forwardRef } from "react";
import { useHistory } from "react-router";

export function withHistory(Component: any) {
  return forwardRef((props: any, ref: any) => {
    const history = useHistory();
    return <Component {...props} history={history} ref={ref} />;
  });
}