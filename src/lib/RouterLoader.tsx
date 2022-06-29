import { ParentComponent, createContext, createSignal, useContext, createResource, createEffect, createMemo, on, Show, children } from "solid-js"
import type { Router, RouteComponent } from "./router"

interface CRouter {
	router: Router
}

interface CtxRouter {
	pathname: string
	push: (pathname: string) => void
}


const RouterContext = createContext<CtxRouter>({ pathname: "", push: () => { } })


const [component, setComponent] = createSignal<RouteComponent<any> | null>(null)
const [pathname, setPathname] = createSignal(window.location.pathname)

const Component = (props: any) => {
	const c = component()
	if (!c)
		return null
	return c(props)
}

const RouterLoader: ParentComponent<CRouter> = (props) => {

	const c = children(() => props.children)
	const getRoute = createMemo(() => props.router.find(pathname()))

	const [data, { mutate }] = createResource(pathname, async () => {
		const route = getRoute()
		if (route.fn?.getInitalProps)
			return await route.fn.getInitalProps()
		return true
	})

	createEffect(on(data, () => {
		if (data() && !component())
			setComponent(() => getRoute().fn)
	}))

	const push = (pathname: string) => {
		window.history.pushState({}, "", pathname)
		mutate(false)
		setComponent(null)
		setPathname(pathname)
	}

	const store = {
		pathname: pathname(),
		push,
	}

	return <RouterContext.Provider value={store}>
		<Show when={component()} fallback={<p>Loading....</p>}>
			<Component {...data()} children={c()}/>
		</Show>	
	</RouterContext.Provider>
}

export const useRouter = () => {
	return useContext(RouterContext)
}

export default RouterLoader;