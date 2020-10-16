import { LightningElement, api, wire, track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";


import { refreshApex } from '@salesforce/apex';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';
const columns = [{ label: 'Name', fieldName: 'Name', type: 'text', editable: true },
{ label: 'Length', fieldName: 'Length__c', type: 'text', editable: true },
{ label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
{ label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
];

export default class BoatSearchResults extends LightningElement {


    @api selectedBoatId;
    columns = columns;
    @api
    boatTypeId;
    @track
    boats;
    isLoading;

    // wired message context
    @wire(MessageContext)
    messageContext;

    // wired getBoats method 
    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(result) {
        this.notifyLoading(true);
        this.boats = result;
        console.table(this.boats)
        if (result.error) {
            console.log(result.error.message);
        }
        this.notifyLoading(false);
    }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    @api
    searchBoats(boatTypeId) {
        this.notifyLoading(true);
        this.boatTypeId = boatTypeId;
        this.notifyLoading(false);
    }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api
    async refresh() {
        this.notifyLoading(true);
        await refreshApex(this.boats);
        this.notifyLoading(false);
    }

    // this function must update selectedBoatId and call sendMessageService

    updateSelectedTile(event) {
        if (event && event.detail) {
            console.log(event.detail.boatId);
            this.selectedBoatId = event.detail.boatId;
            this.sendMessageService(this.selectedBoatId);
        }
    }



    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {

        // explicitly pass boatId to the parameter recordId
        const recordId = {
            detail: { recordId: boatId }
        };
        publish(this.messageContext, BOATMC, recordId);
    }


    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {

        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput =>
            updateRecord(recordInput)
        );

        Promise.all(promises)
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: SUCCESS_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: SUCCESS_VARIANT,
                    })
                );
                this.draftValues = [];
                return this.refresh();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: ERROR_VARIANT,
                    })
                );

                this.notifyLoading(false);
            })
            .finally(() => {
                this.draftValues = [];
            });
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        this.isLoading = isLoading;
        if (this.isLoading) {
            this.dispatchEvent(new CustomEvent("loading"));
        } else {
            this.dispatchEvent(new CustomEvent("doneloading"));
        }
    }



}