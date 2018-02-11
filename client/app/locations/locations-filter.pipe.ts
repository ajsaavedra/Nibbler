import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'locationsFilter'
})

export class LocationsFilterPipe implements PipeTransform {
    transform(locations: any[], filters: string): any[] {
        if (!filters || filters.length === 0) {
            return locations;
        }

        const filtersArray = filters.split(' ');
        const filterOut = [];

        locations.forEach(loc => filtersArray.forEach(f => {
            if (!loc.options[f]) {
                filterOut.push(loc);
            }
        }));

        return locations.filter(loc => !filterOut.includes(loc));
    }
}
