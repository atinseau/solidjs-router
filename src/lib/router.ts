import { ParentComponent } from "solid-js"

// type Dictionary<T> = { [key: string]: T }

type Req = {
	body?: any
}

type RouteReq<T> = Req & T
type PComponent<T, U> = ParentComponent<RouteReq<T>> & U

export type RouteComponent<T> = PComponent<RouteReq<T>, {
	getInitalProps?: () => Promise<T>
}>


enum Method {
	GET = "GET",
	POST = "POST",
	DELETE = "DELETE"
}

interface JsonRoute {
	endpoint: string
	method?: Method
	routes?: JsonRoute[]
}

class Route<T = any>  {

	endpoint: string
	routes: Route[] = []

	method: Method | null = null
	fn: RouteComponent<T> | null = null

	constructor(endpoint: string, fn: RouteComponent<T> | null) {
		this.endpoint = endpoint

		if (fn) {
			this.method = Method.GET
			this.fn = fn
		}
	}

	toJSON(): JsonRoute {
		if (this.fn && this.method) {
			return {
				endpoint: this.endpoint,
				method: this.method
			}
		}
		return {
			endpoint: this.endpoint,
			routes: this.routes.map(route => route.toJSON())
		}
	}

	static group(endpoint: string, routes: Route[]) {
		const route = new Route(endpoint, null)
		route.routes = routes
		return route
	}
}

class Router {

	private endpoint: string
	private routes: Route[]

	constructor(endpoint: string, routes: Route[]) {
		this.endpoint = endpoint
		this.routes = routes
	}

	toJSON() {
		return {
			endpoint: this.endpoint,
			routes: this.routes.map(route => route.toJSON())
		}
	}

	private static rfind(path: string, route: Route, endpoint: string, root: boolean = false): Route {
		if (root) {
			if (path.search(endpoint) != 0)
				throw new Error(`Path ${path} does not match ${endpoint}`)
		} else {
			if (route.endpoint.search(path) != 0)
				throw new Error(`Path ${path} does not match ${route.endpoint}`)
		}

		let remaining = path.substring(route.endpoint.length - (route.endpoint === "/" ? 1 : 0))
		if (remaining.length > 1 && remaining[remaining.length - 1] === "/")
			remaining = remaining.substring(0, remaining.length - 1)
		if (!remaining.length)
			remaining = "/"

		let subroute = route.routes.find(route => route.endpoint === remaining)
		if (!subroute) {
			const s = remaining.split("/")
			let t = 2
			while (t < s.length + 1) {
				const subpath = s.slice(0, t).join("/")
				subroute = route.routes.find(route => route.endpoint === subpath)
				if (subroute) {
					remaining = s.join("/")
					break
				}
				t++
			}
			if (!subroute)
				throw new Error(`No route found for ${path}`)
			return this.rfind(remaining, subroute, subroute.endpoint, true)
		}
		if (subroute.fn)
			return subroute
		return this.rfind(remaining, subroute, subroute.endpoint)
	}

	find(path: string): Route {
		return Router.rfind(path, (this as unknown) as Route, this.endpoint, true)
	}
}

const createRouter = (endpoint: string, routes: Route[] = []) => {
	const router = new Router(endpoint, routes)
	// HMR
	if (import.meta.env.MODE === "development") {
		const app = document.querySelector('#root')
		if (app)
			app.innerHTML = ""
	}
	return router
}



export {
	createRouter,
	Route,
	Router
}