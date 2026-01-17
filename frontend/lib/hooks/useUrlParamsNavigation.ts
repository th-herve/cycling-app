import { useRouter, useSearchParams } from "next/navigation";

/*
 * Help refresh a page with different url parameters
 */
export const useUrlParamsNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * Update the current search params by adding the given key/value pairs.
   * The value is updated if the key already exists.
   *
   * To remove a key, pass null as the value.
   *
   * Usage: updateAndPushUrl({ year: "2025", sorted: null })
   */
  const updateAndPushUrl = (newParams: Record<string, string | null>) => {
    // Get the current params
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`?${params.toString()}`);
  };

  return { updateAndPushUrl };
};
