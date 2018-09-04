import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import { DialogService } from '../services/dialog.service';

@Component({
    selector: 'nibbler-dialog-component',
    templateUrl: './app/common/dialog.component.html'
})

export class DialogComponent implements OnInit, OnDestroy {
    @ViewChild('nibblerModal') openModal: ElementRef;

    private isActive: boolean;
    private message: string;
    private subscriptions = [];

    constructor(private dialog: DialogService, public element: ElementRef) {}

    ngOnInit() {
        this.subscriptions.push(
            this.dialog.messageEmitter.subscribe(message => this.message = message),
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
