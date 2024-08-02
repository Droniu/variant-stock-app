import { Box, Button, EditIcon, Text } from "@saleor/macaw-ui";
import { Product, ProductVariant } from "../../generated/graphql";
import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";

interface VariantRowProps {
  variant: Partial<ProductVariant>;
  product: Partial<Product>;
}

export const VariantRow = ({ variant, product }: VariantRowProps) => {
  const bridge = useAppBridge();
  const navigateToVariant = ({
    productId,
    variantId,
  }: {
    productId: string;
    variantId: string;
  }) => {
    bridge.appBridge?.dispatch(
      actions.Redirect({
        to: `/products/${productId}/variant/${variantId}`,
        newContext: true,
      })
    );
  };
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="space-between"
      borderTopStyle="solid"
      borderColor="default2"
      alignItems="center"
      padding={2}
      marginTop={4}
      borderWidth={1}
    >
      <Box
        as="img"
        src={variant?.media?.[0]?.url ?? product.thumbnail?.url}
        width={12}
        height={12}
        borderRadius={2}
      />
      <Box>{product?.name}</Box>
      <Box>{variant?.name}</Box>
      <Box>{variant?.sku}</Box>
      <Box display="flex" flexDirection="column" __minWidth="300px">
        {variant?.stocks?.map((stock) => (
          <Text key={stock?.warehouse?.id} color="default2" fontSize={2}>
            {stock?.warehouse.name}: {stock?.quantity}
          </Text>
        ))}
      </Box>
      <Button
        onClick={() =>
          navigateToVariant({
            productId: product?.id ?? "",
            variantId: variant?.id ?? "",
          })
        }
        icon={<EditIcon />}
        variant="secondary"
      />
    </Box>
  );
};
