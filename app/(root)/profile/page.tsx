import AddressForm from "@/components/AddressForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth, currentUser } from "@clerk/nextjs/server";

interface pageProps {
	searchParams: {
		type: "create" | "update";
	};
}

const Page = async ({ searchParams }: pageProps) => {
	const currentClerkUser = await currentUser();
	const user = await getUserById(currentClerkUser?.id as string);
	return (
		<div>
			<AddressForm searchParams={searchParams} user={user} />
		</div>
	);
};

export default Page;
