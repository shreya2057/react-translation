import { SearchIcon } from "@chakra-ui/icons";
import {
  CloseButton,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { FormControl } from "../../components/form/FormControl";
import { useAddSearchParams } from "../../hooks/useAddSearchParams";
import { useCategoryQuery, useProductQuery } from "../../services/product";
import { colors } from "../../theme/colors";
import { ItemsType } from "../../type";
import { parseQueryString } from "../../utils/parseQueryString";
import { selectOptions } from "../../utils/selectOptions";
import Banner from "./components/Banner";
import ItemCard from "./components/ItemCard";
import { NotFound } from "../../components/NotFound";

const initialValues = {
  product: "",
  category: "",
};

function Shopping() {
  const { data: categories } = useCategoryQuery();

  const location = useLocation();
  const searchValue = parseQueryString(location.search) as typeof initialValues;

  const { control, handleSubmit, reset, watch } = useForm<typeof initialValues>(
    {
      defaultValues: initialValues,
    }
  );

  const { data: products, isLoading } = useProductQuery({
    category: watch("category"),
    title: searchValue?.product,
  });

  const { addSearchParams, deleteSearchParams } = useAddSearchParams();

  const columns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    md: `repeat(${(products?.length ?? 0) >= 3 ? 3 : products?.length}, 1fr)`,
    xl: `repeat(${(products?.length ?? 0) >= 4 ? 4 : products?.length}, 1fr)`,
  });

  const categoriesList = selectOptions({
    options: categories ?? [],
    labelKey: "name",
    valueKey: "_id",
  });

  return (
    <VStack
      minHeight={"100%"}
      width={"100%"}
      justifyContent={{ base: "center", lg: "start" }}
      gap={6}
      pb={6}
    >
      <Banner />
      <HStack
        width={"100%"}
        gap={{ base: 6, md: 0 }}
        align={"center"}
        justifyContent={"space-between"}
        px={{ base: 16, sm: 28, md: 28 }}
      >
        <form onChange={handleSubmit(addSearchParams)}>
          <FormControl
            type="text"
            control={control}
            name="product"
            inputControl="input"
            placeholder="Search products"
            leftElement={<SearchIcon color="gray.300" />}
            rightElement={
              searchValue?.product && (
                <CloseButton
                  onClick={() => {
                    deleteSearchParams("product");
                    reset({});
                  }}
                />
              )
            }
          />
        </form>
        <Flex w={"20%"}>
          <FormControl
            control={control}
            name="category"
            options={categoriesList}
            inputControl="single-select"
            placeholder="Categories"
            placeholderColor={colors.brand[800]}
          />
        </Flex>
      </HStack>
      <Flex
        width={"100%"}
        justifyContent={"start"}
        px={{ base: 16, sm: 28, md: 28 }}
      >
        {isLoading ? (
          <HStack gap={2} width={"100%"} justifyContent={"center"}>
            <Spinner size={"lg"} color="brand.700" />
            <Text fontWeight={"bold"} textColor={"brand.800"}>
              Loading...
            </Text>
          </HStack>
        ) : products?.length ? (
          <SimpleGrid
            templateColumns={columns}
            gap={6}
            width={{ base: "100%", md: "min-content" }}
            alignItems={"center"}
            justifyItems={"center"}
          >
            {products?.map((items: ItemsType, index: number) => (
              <ItemCard items={items} key={index} />
            ))}
          </SimpleGrid>
        ) : (
          <NotFound />
        )}
      </Flex>
    </VStack>
  );
}

export default Shopping;
