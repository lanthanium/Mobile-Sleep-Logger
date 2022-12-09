import { Component, OnInit } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { format, parseISO } from 'date-fns';




@Component({
  selector: 'app-logging',
  templateUrl: './logging.page.html',
  styleUrls: ['./logging.page.scss'],
})
export class LoggingPage implements OnInit {


sleepTime = new Date;
wakeTime = new Date;

sleepCapacitor: string;
wakeCapacitor: string; 

sleepStartString: string = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
wakeString: string = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

showPrompt: boolean = false;
defaultButton: boolean = true;
addAnother: boolean = false;

logSummary?: OvernightSleepData;



  constructor(private sleepService: SleepService) {
   }

  ngOnInit() {
    
  }


    /*********************************************************************************************
   * This function is called by an html button when a user wants to add another entry.  The page
   * will be reset to default. &nbsp is purely for stylistic purposes. 
   **********************************************************************************************/
  reloadCurrentPage():void {
    this.sleepStartString = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    this.wakeString= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    this.defaultButton = true;
    this.addAnother = false;
  }

  testing(time):void
  {
    console.log(time);
  }



  /*********************************************************************************************
   * Function is called everytime user selects a date from the ion-date-time component. 
   * Creates a new Date object from the parsed string date object passed by the ion-date-time component
   * Populates the page with what the user selected
   **********************************************************************************************/
  sleepTimeChanged(time):void 
  {
    this.sleepTime = new Date(time);
    this.sleepCapacitor = time;
    this.sleepStartString = format(parseISO(time), 'Pp');
    if (this.wakeString != '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') this.showPrompt = true;
  }



  /*********************************************************************************************
   * wakeTimeChanged() works exactly the same way as sleepTimeChanged() except creates a new
   * Date object for the sleepend date
   **********************************************************************************************/
  wakeTimeChanged(time):void
  {
    this.wakeTime = new Date(time);
    this.wakeCapacitor = time;
    console.log(this.wakeCapacitor);
    console.log(this.wakeTime);
    console.log(new Date(this.wakeTime.toString()));
    this.wakeString = format(parseISO(time), 'Pp');
    if (this.sleepStartString != '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') this.showPrompt = true;
  }



  /*********************************************************************************************
   * Function is called when user is ready to submit the times they slept and woke up at. 
   * Creates a new OvernightSleepData object from the sleeptime/waketime variables
   * Calls on sleepService's methods to pass this newly created object into the local array along
   * with Preference Storage
   **********************************************************************************************/
  sleepSummary = async():Promise<void> => {
    if (this.sleepStartString=='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' || this.wakeString=='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') return;
    if (this.sleepTime.getTime() - this.wakeTime.getTime() > 0)
    {
      this.errorPopUp();
      return;
    }
    else
    {
      this.defaultButton = false;
      this.addAnother = true;
      this.logSummary = new OvernightSleepData(this.sleepTime, this.wakeTime);
      await this.sleepService.addOvernightToStorage(this.logSummary);
      //this.sleepService.updateAverageSleep();
    }
  }


  /*********************************************************************************************
   * Function is called when user selects a wake time that is before the sleep start time
   **********************************************************************************************/
  errorPopUp(): boolean{
    if (this.sleepTime.getTime() - this.wakeTime.getTime() > 0) return true;
    else return false;
  }


}

