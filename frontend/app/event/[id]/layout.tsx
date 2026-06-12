import DefaultLayout from "@/components/layouts/defaultLayout";

interface Props {
  children: React.ReactNode;
}

const Page = async ({ children }: Props) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Page;
