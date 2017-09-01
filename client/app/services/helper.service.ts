import { Injectable } from '@angular/core';

@Injectable()
export class Helper {
    starRating = function(rating) {
        return new Array(5)
            .fill(undefined)
            .map((star, i) => {
                return '<i class="fa fa-star' + (i < rating ? '"></i>': '-o"></i>');
            })
        .join('\n');
    };
}
