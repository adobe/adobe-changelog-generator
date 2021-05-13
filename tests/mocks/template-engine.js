const generatedTemplate = `
Magento2
=============
<!--namespaces_magento_magento2_scope_start-->
## 2.4.3 (10-05-21) magento2 or magento or 2.4-develop

* [magento/magento2#5555](https://github.com/magento/magento2/pull/32802)
-- Load draggable and resizable jquery-ui chunks for dialog widget only if needed by [@martasiewierska](https://github.com/martasiewierska)
<!--namespaces_magento_magento2_scope_end-->
Inventory
=============
<!--namespaces_magento_inventory_scope_start-->
## 1.2.2 (27-11-20) inventory or magento or 1.2-develop

* [magento/inventory#5555](https://github.com/magento/inventory/pull/3240)
-- MC-30348: [Inventory]Rest salesShipOrderV1 API w/ Bundles error: "You can't create a shipment without products" by [@engcom-Golf](https://github.com/engcom-Golf)
<!--namespaces_magento_inventory_scope_end-->`
const generateByTemplate = jest.fn(() => generatedTemplate);

module.exports = {
    generateByTemplate,
    generatedTemplate
}
