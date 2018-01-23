// export class ProductFilterPipe implements PipeTransform {
//
//   transform(products: IProduct[], filterText: string = ''): IProduct[] {
//     return filterText === '' ? products : products.filter(product => {
//       return product.productName.toLowerCase().includes(filterText.toLowerCase());
//     });
//   }
//
// }

export default(value) => {
  // const date = new Date(value)
  return product.productName.toLowerCase().includes(filterText.toLowerCase());
  // return date.toLocaleString(['en-US'], {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
}
