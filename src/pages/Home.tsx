import { useRouter } from "../lib/RouterLoader";

const Home = () => {

	const router = useRouter()

	return <>
		<h1>salut tout le monde</h1>
		<button onClick={() => router.push('/bye')}>Go bye</button>
	</>
}

export default Home;