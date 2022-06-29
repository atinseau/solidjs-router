import { render } from "solid-js/web"

import { createEffect, createSignal } from "solid-js"

import RouterLoader from './lib/RouterLoader'
import router from "./routes"

import './index.css'


function App() {
	return <RouterLoader router={router}/>
}


render(() => <App />, document.getElementById('root') as HTMLElement);

