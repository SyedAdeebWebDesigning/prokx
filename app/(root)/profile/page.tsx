import AddressForm from "@/components/AddressForm";
import { getUserById } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

interface pageProps {
	searchParams: {
		type: "create" | "update";
	};
}

const Page = async({ searchParams }: pageProps) => {
    const clerkUser = await currentUser();
		const user = await getUserById(clerkUser?.id as string);
	return (
		<div>
			<AddressForm searchParams={searchParams} user={user} />
		</div>
	);
};

export default Page;
