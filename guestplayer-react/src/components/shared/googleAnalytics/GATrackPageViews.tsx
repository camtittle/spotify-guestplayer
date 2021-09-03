import { Fragment, useEffect } from "react";
import { useHistory } from "react-router";

export const GATrackPageViews: React.FC = ({children}) => {
  
  const history = useHistory();

  useEffect(() => {
    const unregister = history.listen((location) => {
      gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      })
    });

    return () => {
      unregister();
    }
  }, [history]);


  return (
    <Fragment>
      {children}
    </Fragment>
  );

}