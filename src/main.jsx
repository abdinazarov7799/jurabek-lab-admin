import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import Query from "./services/query/index.jsx";
import Theme from "./theme/theme.jsx";
import Router from "./router/router.jsx";
import OverlayLoader from "./components/OverlayLoader.jsx";
import i18n from "./services/i18n/index.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <Suspense fallback={<OverlayLoader/>}>
        <Query>
            <Theme>
                <Router/>
            </Theme>
        </Query>
    </Suspense>
)
