import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import { EditDialogService } from '../services/edit-dialog.service';

@Component({
    selector: 'nibbler-edit-dialog-component',
    templateUrl: './app/common/edit-dialog.component.html'
})

export class EditDialogComponent implements OnInit, OnDestroy {
    @ViewChild('nibblerModal') openModal: ElementRef;

    private isActive: boolean;
    private subscriptions = [];
    @Input() location;

    constructor(private dialog: EditDialogService, public element: ElementRef) {}

    ngOnInit() {
        this.subscriptions.push(
            this.dialog.activeEmitter.subscribe(status => {
                this.isActive = status;
                if (this.isActive) { this.openModal.nativeElement.click(); }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.dialog.toggleActive(false);
    }
}
