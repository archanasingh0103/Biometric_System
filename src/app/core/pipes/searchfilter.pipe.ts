import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(items:any, value:string):any {
    if (!items) {
      return null;
    }
    if (!value)
    {
      return items;
    }

    return items.filter((singleItem: any) =>
      JSON.stringify(singleItem).toLowerCase().includes(value.toLocaleLowerCase())
    );
  }

}
