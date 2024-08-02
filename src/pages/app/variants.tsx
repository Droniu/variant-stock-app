import { Box, Combobox, Spinner, Text } from "@saleor/macaw-ui";
import {
  Product,
  ProductVariant,
  StockAvailability,
  useChannelsListQuery,
  useProductStockQueryQuery,
} from "../../../generated/graphql";
import { VariantRow } from "../../components/VariantRow";
import React from "react";

export const Variants = () => {
  const [{ data: channelsData, fetching: fetchingChannels }] = useChannelsListQuery();
  const [channelSlug, setChannelSlug] = React.useState<string>("");
  const [result] = useProductStockQueryQuery({
    variables: {
      first: 100,
      where: {
        stockAvailability: StockAvailability.OutOfStock,
      },
      channel: channelSlug,
    },
    pause: channelSlug === "",
  });

  React.useEffect(() => {
    if (channelsData?.channels && channelSlug === "") {
      setChannelSlug(channelsData.channels[0].slug);
    }
  }, [channelsData, channelSlug]);

  return (
    <Box
      padding={4}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box display="flex" gap={2} alignItems="center">
        <Text fontSize={5} fontWeight="medium">
          Variants out of stock for channel:
        </Text>
        <Combobox
          value={channelSlug}
          onChange={(value) => setChannelSlug(value as string)}
          options={(channelsData?.channels ?? []).map((value) => ({
            value: value.slug,
            label: value.name,
          }))}
        />
      </Box>
      {result.data ? (
        <Box width="100%">
          {result.data.products?.edges.flatMap((edge) =>
            edge.node.variants?.map((variant) => (
              <VariantRow
                key={variant.id}
                variant={variant as ProductVariant}
                product={edge.node as Product}
              />
            ))
          )}
        </Box>
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export default Variants;
