const ordersData = orders.map((order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
}));

const fuse = new Fuse(ordersData, {
  keys: ["orderNumber"],
});
