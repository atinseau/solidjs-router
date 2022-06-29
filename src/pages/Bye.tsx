import type { RouteComponent } from "../lib/router";
import { useRouter } from "../lib/RouterLoader";

interface IBye {
	name: string
}

const Bye: RouteComponent<IBye> = (props) => {

	const router = useRouter()

	console.log(props.name)

	return <div>
		<h1>salut tout le monde</h1>
		<button onClick={() => router.push("/")}>Go home</button>
	</div>
}


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

Bye.getInitalProps = async () => {

	await sleep(200)

	return {
		name: "blablabla"
	}
}

export default Bye;