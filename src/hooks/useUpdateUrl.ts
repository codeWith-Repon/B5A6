import { useSearchParams } from "react-router";

export const useUpdateUrl = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    }
};

