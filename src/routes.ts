import { createRouter, Route } from "./lib/router"

import Bye from "./pages/Bye"
import Home from "./pages/Home"
import About from "./pages/About"

const router = createRouter("/",  [

	new Route("/", Home),

	new Route("/bye", Bye),

	Route.group("/users", [
		new Route("/about", About)
	])

])


export default router