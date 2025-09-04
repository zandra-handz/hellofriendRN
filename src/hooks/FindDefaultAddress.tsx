
// returns null if no addresses, default if default exists, else returns first address
export const findDefaultAddress = (friendAddresses) => {
 
  if (!friendAddresses || !(friendAddresses?.length > 0)) {
    return;
  }
  return (
    friendAddresses.find((address) => address?.is_default === true) ||
    friendAddresses[0]
  );
};
