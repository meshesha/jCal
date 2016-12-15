/*
@author: Tadele Meshesha
@creationDate: 15/12/2016
@version: 1.1.0
@authorEmail: meshesha1@gmail.com
@license: GPL2
*/ 
(function($) {
	$.fn.extend({
		jcal: function(options) {
			var defaults = {
				cal:'gre', /* jewish or gre(gregorian)*/
				lang: 'en',  /* he (hebrew) or en(english)*/
				caldate: false,
				dataType: 'xml', /*xml, json, php*/			
				url: '',
				phpPlatform:'', /*for now joomla only (or empty) */
				moduleName: '', /*joomla module name without 'mod_'*/
				eventNum: '2',
				maxWidth: false,
				setWidth: false,
				buttons: false,
				jQueryui: false,
				timeFormat:'12h', /*12h, 24h*/
				monthToView: false, /*['mm','YYYY']*/
				calBorder:'4px solid #ff3300',/*false*/
				calTitleBgcolor:'#dbecfc',
				calTitleTxtcolor:'#545454',
				calTitleFontSize:'',
				weekdaysBgcolor:'#3588fc',
				weekdaysTxtcolor:'#ffffff',
				weekdaysFontSize:'',
				daysBgcolor:'#ffffff',
				daysTxtcolor:'#3588fc',
				daysFontSize:'',
				shabatDaysBgcolor:'#e3edff',
				shabatDaysTxtcolor:'#0828fc',
				shabatDaysFontSize:'',
				blankDaysBgcolor:'#dbdbdb'
				
			}
			var options = $.extend(defaults, options), d;
			if(options.caldate != false){
				d = new Date(options.caldate);				
			}else{
				d = new Date();
			}
			var divId = $(this).attr('id'),
				elmWidth = $('#'+divId).width(),
				isRtl = (options.lang=='en')?'ltr':'rtl',
				currentMonth = d.getMonth() + 1,
				currentYear = d.getFullYear(),
				currentDay = d.getDate(),
				viewMode = 'monthMode',
				monthNames_en = options.monthNames || ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				fullMonthNames_en = options.monthNames || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthNames_he = options.monthNames || ["ינו'", "פבר'", "מרץ", "אפר'", "מאי", "יוני", "יולי", "אוג'", "ספט'", "אוק'", "נוב'", "דצמ'"],
				fullMonthNames_he = options.monthNames || ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
				shortMonthNames = options.shortMonthNames || ["Ja", "Fe", "Mr", "Ap", "My", "Jn", "Jl", "Ag", "Sp", "Oc", "No", "De"], /*לא בשימוש כרגע*/
				dayNames_en = options.dayNames || ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
				fulldayNames_en = options.dayNames || ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				dayNames_he = options.dayNames || ["א'","ב'","ג'","ד'","ה'","ו'","שבת"],
				fullDayNames_he = options.dayNames || ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"],
				shortDayNames = options.shortDayNames || ["Su","Mo","Tu","We","Th","Fr","Sa"],
				latin2hebrew = archaicNumbers([
				[1000,''],
				[400,'ת'],
				[300,'ש'],
				[200,'ר'],
				[100,'ק'],
				[90,'צ'],
				[80,'פ'],
				[70,'ע'],
				[60,'ס'],
				[50,'נ'],
				[40,'מ'],
				[30,'ל'],
				[20,'כ'],
				[10,'י'],
				[9,'ט'],
				[8,'ח'],
				[7,'ז'],
				[6,'ו'],
				[5,'ה'],
				[4,'ד'],
				[3,'ג'],
				[2,'ב'],
				[1,'א'],
				[/יה/, 'ט״ו'],
				[/יו/, 'ט״ז'],
				[/([א-ת])([א-ת])$/, '$1״$2'], 
				[/^([א-ת])$/, "$1׳"] 
			]);				
			//general
			//Add jcal class
			if(!$('#'+divId).hasClass('jcal')){
				$('#'+divId).addClass('jcal');
			}
			//////////Cheke divId///////////
			//for joomla - jewish calendar module
			var unq_id_chk = (divId.indexOf('jewish_calander_cal_container_')!=-1)?true:false;
			var id_suffix;
			if(unq_id_chk){
				id_suffix =  divId.split("_")[4];
			}else{
				id_suffix = divId;
			}
			//alert("id_suffix="+id_suffix);
			////////////cheke direction//////////////////
			function getDirection(elem) {
				var dir;
				if (window.getComputedStyle) { // all browsers
					dir = window.getComputedStyle(elem, null).getPropertyValue('direction');
				} else {
					dir = elem.currentStyle.direction; // IE5-8
				}
				return dir;
			} 
			var inputDir = getDirection($(this)[0]);
			//alert(inputDir)
			if (inputDir=="rtl"){
				$('#'+divId).attr("dir","ltr");
			} 			
			///////////////////////////////////////////
			if (options.maxWidth != false){
				$('#'+divId).css('maxWidth',options.maxWidth);
			}
			if (options.setWidth != false){
				$('#'+divId).css('width',options.setWidth);
			}
			
			if (options.calBorder != false){
				$('#'+divId).css('border',options.calBorder);
			}			
			//set week days namse type for title
			function setDaysNames(){
				if(options.lang=='en'){
					if (Number(elmWidth)<217){
						dayNames = shortDayNames;
					}else if(Number(elmWidth)>=217 && Number(elmWidth)<= 470){
						dayNames = dayNames_en;
					}else{
						dayNames = fulldayNames_en;
					}
				}else if(options.lang=='he'){
					if (Number(elmWidth)<217){
						dayNames = dayNames_he
					}else{
						dayNames = fullDayNames_he;
					}
				}
			}
			setDaysNames();
			// Add Day Of Week Titles
			$('#' + divId).append('<div class="jcal-day-title-wrap" id="jcal-day-title-wrap_'+id_suffix+'" dir="'+isRtl+'"><div>'+dayNames[0]+'</div><div>'+dayNames[1]+'</div><div>'+dayNames[2]+'</div><div>'+dayNames[3]+'</div><div>'+dayNames[4]+'</div><div>'+dayNames[5]+'</div><div>'+dayNames[6]+'</div></div><div class="jcal-day-wrap" dir="'+isRtl+'"></div>');

			// Add Header & event list markup
			if(!options.buttons){
				if(options.lang=='en'){
					$('#' + divId).prepend('<div class="jcal-header" id="jcal-header_'+id_suffix+'">'+
												'<div class="jcal-toolbar">'+
													'<div class="jcal-left">'+
														'<span class="jcal-prev jcal-icon jcal-icon-left-single-arrow" title="Previous month"></span>'+
													'</div>'+
													'<div class="jcal-center">'+
														'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'"></div>'+
														'<span class="jcal-list-month jcal-icon-list"  title="List view"></span>'+
													'</div>'+
													'<div class="jcal-right">'+
														'<span class="jcal-next jcal-icon jcal-icon-right-single-arrow" title="Next month"></span>'+
													'</div>'+
												'</div>'+
											'</div>').append('<div class="jcal-event-list" id="jcal-event-list_'+id_suffix+'"></div>');											
				}else if(options.lang=='he'){
					$('#' + divId).prepend('<div class="jcal-header" id="jcal-header_'+id_suffix+'">'+
												'<div class="jcal-toolbar">'+
													'<div class="jcal-left">'+
														'<span class="jcal-next jcal-icon jcal-icon-left-single-arrow" title="חודש הבא"></span>'+
													'</div>'+
													'<div class="jcal-center">'+
														'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'"></div>'+
														'<span class=" jcal-list-month jcal-icon-list" title="תצוגת רשימה"></span>'+
													'</div>'+
													'<div class="jcal-right">'+
														'<span class="jcal-prev jcal-icon jcal-icon-right-single-arrow" title="חודש קודם"></span>'+
													'</div>'+
												'</div>'+
											'</div>').append('<div class="jcal-event-list" id="jcal-event-list_'+id_suffix+'"></div>');
				}
			}else{
				if(options.lang=='en'){
					$('#' + divId).prepend('<div class="jcal-header" id="jcal-header_'+id_suffix+'">'+
												'<div class="jcal-toolbar">'+
													'<div class="jcal-left">'+ 
														'<button class="jcal-button jcal-corner-left jcal-button-left jcal-icon jcal-icon-left-single-arrow" title="Previous month"></button>'+
														'<button class="jcal-today-button jcal-button jcal-state-default jcal-corner-left jcal-corner-right jcal-state-disabled" disabled="disabled">today</button>'+
													'</div>'+
													'<div class="jcal-center">'+
														'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'"></div>'+
														'<button class="jcal-month-list-button jcal-button jcal-corner-left jcal-corner-right">List</button>'+
													'</div>'+
													'<div class="jcal-right">'+
														'<button class="jcal-button jcal-corner-right jcal-button-right jcal-icon jcal-icon-right-single-arrow" title="Next month"></button>'+
													'</div>'+
												'</div>'+
											'</div>').append('<div class="jcal-event-list" id="jcal-event-list_'+id_suffix+'"></div>');
				}else if(options.lang=='he'){
					$('#' + divId).prepend('<div class="jcal-header" id="jcal-header_'+id_suffix+'">'+
												'<div class="jcal-toolbar">'+
													'<div class="jcal-left">'+
														'<button class="jcal-button jcal-corner-left jcal-button-right jcal-icon jcal-icon-left-single-arrow" title="חודש הבא"></button>'+
														'<button class="jcal-today-button jcal-button jcal-state-default jcal-corner-left jcal-corner-right jcal-state-disabled" disabled="disabled">היום</button>'+
													'</div>'+
													'<div class="jcal-center">'+
														'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'"></div>'+
														'<button class="jcal-month-list-button jcal-button jcal-corner-left jcal-corner-right">רשימה</button>'+
													'</div>'+
													'<div class="jcal-right">'+
														'<button class="jcal-button jcal-corner-right jcal-button-left jcal-icon jcal-icon-right-single-arrow" title="חודש קודם"></button>'+
													'</div>'+
												'</div>'+
											'</div>').append('<div class="jcal-event-list" id="jcal-event-list_'+id_suffix+'" dir="rtl"></div>');
				}				
			}

			if(options.cal=='jewish'){
				var currentJd = new Date(Number(currentYear),Number(currentMonth)-1,Number(currentDay));
				var jdateObject = new GregToHeb(currentJd);//d
				currentYear = jdateObject.y;
				currentMonth = jdateObject.m;
				currentDay = jdateObject.d;					
			}
			// How many days are in this month?
			function daysInMonth(m, y){
				if(options.cal=='gre'){
					return m===2?y&3||!(y%25)&&y&15?28:29:30+(m+(m>>3)&1);
				}else if(options.cal=='jewish'){
					var jdObj = HeMonthLen(y, m);
					return jdObj;						
				}
			}			
			// Massive function to build the month
			//setJcalMonth('12','2016');
			function setJcalMonth(m, y){
				//if the new month and year equal to current month and year
				//then remove "To day" button.
				if(options.cal=='gre'){
					//set months names for title
					if(options.lang=='en'){
						if (Number(elmWidth)<250){
							monthNames = monthNames_en;
						}else{
							monthNames = fullMonthNames_en; 
						}
					}else if(options.lang=='he'){
						if (Number(elmWidth)<250){
							monthNames = monthNames_he; 
						}else{
							monthNames = fullMonthNames_he; 
						}
					}
				}
				setDaysNames();
				if (m == currentMonth && y == currentYear){
					$('#'+divId+' .jcal-reset').remove();
					$('#'+divId+' .jcal-today-button').addClass('jcal-state-default jcal-state-disabled').attr('disabled','disabled');
				}
				
				$('#' + divId).data('setMonth', m).data('setYear', y);
				// Get number of days
				var dayQty = daysInMonth(m, y),mZeroed,firstDay;
					// Get day of the week the first day is
				if(options.cal=='gre'){	
					mZeroed = m -1,
					firstDay = new Date(y, mZeroed, 1, 0, 0, 0, 0).getDay();
				}else if(options.cal=='jewish'){
					mZeroed = m;
					var he2gre = HebToGreg(y, mZeroed, 1);
					var jdObj = new GregToHeb(he2gre);
					firstDay = jdObj.day;						
				}
				// Remove old days
				$('#' + divId + ' .jcal-day, #' + divId + ' .jcal-day-blank').remove();
				$('#'+divId+' .jcal-event-list').empty();
				$('#'+divId+' .jcal-day-wrap').empty();
				// Print out the days
				for(var i = 0; i < dayQty; i++) {
					var day = i + 1; // Fix 0 indexed days
					var dayNamenum, shabat_suffix, week_num;
					if(options.cal=='gre'){
						dayNamenum = new Date(y, mZeroed, day, 0, 0, 0, 0).getDay();
						shabat_suffix=isShabat(y,mZeroed,day)?'_isShabat':'';
						week_num = weeksinMonth(y, m,day);
					}else if(options.cal=='jewish'){
						var he2gre_2 = HebToGreg(y, mZeroed, day);
						var jdObj_2 = new GregToHeb(he2gre_2);
						dayNamenum = jdObj_2.day;
						shabat_suffix=isShabat(y,mZeroed,day)?'_isShabat':'';						
						week_num =  weeksinMonthJewish(y, m,day);							
					}
					if(options.cal=='gre'){
						if(options.lang=="he"){
							$('#' + divId + ' .jcal-day-wrap').append('<div class="jcals jcal-day jcal-day-event" id="jcal-day_'+id_suffix+shabat_suffix+'" data-number="'+day+'"><div class="jcal-day-number">'+day+'</div><div class="jcal-indicator-wrap"><div id="jcal-events-counter-'+day+'" data-count="0"></div></div><div class="jcal-more-events">עוד...</div></div>');														
							$('#' + divId + ' .jcal-event-list').append('<div class="jcal-list-item-rtl jcal-week-'+week_num+'" id="'+divId+'day'+day+'" data-number="'+day+'"><div class="jcal-event-list-date-rtl">'+fullDayNames_he[dayNamenum]+'<br>'+day+'</div></div>');
						}						
					}else if(options.cal=='jewish'){
						if(options.lang=="he"){
							$('#' + divId + ' .jcal-day-wrap').append('<div class="jcals jcal-day jcal-day-event" id="jcal-day_'+id_suffix+shabat_suffix+'" data-number="'+day+'"><div class="jcal-day-number">'+latin2hebrew.format(day)+'</div><div class="jcal-indicator-wrap"><div id="jcal-events-counter-'+day+'" data-count="0"></div></div><div class="jcal-more-events">עוד...</div></div>');							
							$('#' + divId + ' .jcal-event-list').append('<div class="jcal-list-item-rtl jcal-week-'+week_num+'" id="'+divId+'day'+day+'" data-number="'+day+'"><div class="jcal-event-list-date-rtl">'+fullDayNames_he[dayNamenum]+'<br>'+latin2hebrew.format(day)+'</div></div>');
						}	
					}
					if(options.lang=="en"){
						$('#' + divId + ' .jcal-day-wrap').append('<div class="jcals jcal-day jcal-day-event" id="jcal-day_'+id_suffix+shabat_suffix+'" data-number="'+day+'"><div class="jcal-day-number">'+day+'</div><div class="jcal-indicator-wrap"><div id="jcal-events-counter-'+day+'" data-count="0"></div></div><div class="jcal-more-events">more...</div></div>');
						$('#' + divId + ' .jcal-event-list').append('<div class="jcal-list-item jcal-week-'+week_num+'" id="'+divId+'day'+day+'" data-number="'+day+'"><div class="jcal-event-list-date">'+dayNames[dayNamenum]+'<br>'+day+'</div></div>');
					}
				}
				$('#' + divId + ' .jcal-more-events').hide();
				// Set Today
				var setMonth = $('#' + divId).data('setMonth'),
					setYear = $('#' + divId).data('setYear');
				if (setMonth == currentMonth && setYear == currentYear) {
					$('#' + divId + ' *[data-number="'+currentDay+'"]').addClass('jcal-today');
				}

				// Reset button
				var enMonth,jYear, jMonth;
				if (setMonth == currentMonth && setYear == currentYear) {
					if(options.cal=='gre'){
						$('#' + divId + ' .jcal-toolbar-title-date').html(monthNames[m - 1] +' '+ y);
					}else if(options.cal=='jewish'){
						if(options.lang=='en'){
							enMonth = getJewishMonthName(m,y,'en');//get en jewish month name
							$('#' + divId + ' .jcal-toolbar-title-date').html(enMonth +' '+ y);	
						}else if(options.lang=='he'){
							jYear = latin2hebrew.format(y);
							jMonth = getJewishMonthName(m,y,'he');
							$('#' + divId + ' .jcal-toolbar-title-date').html(jMonth +' ה'+ jYear);
						}							
					}
				} else {
					if(options.cal=='gre'){
						if(!options.buttons){
							if(options.lang=='en'){
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<span class="jcal-prev jcal-icon jcal-icon-left-single-arrow"></span>'+
																			'<span class="jcal-reset jcal-spcl-icon jcal-icon-down-triangle" id="jcal-reset_'+id_suffix+'" title="Set to today"></span>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+monthNames[m - 1] +' '+ y +'</div>'+
																			'<span class="jcal-list-month " id="jcal-reset_'+id_suffix+'" title=""></span>'+
																		'</div>'+
																		'<div class="jcal-right">'+
																			'<span class="jcal-next jcal-icon jcal-icon-right-single-arrow"></span>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-list').removeClass('jcal-icon-month').attr("title","List view");									
								}else{ //listMode
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-month').removeClass('jcal-icon-list').attr("title","Month view");								
								}																		
							}else if(options.lang=='he'){
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<span class="jcal-next jcal-icon jcal-icon-left-single-arrow" title="חודש הבא"></span>'+
																			'<span class="jcal-reset jcal-icon-down-triangle" id="jcal-reset_'+id_suffix+'" title="חזור לחודש הנוכחי"></span>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+monthNames[m - 1] +' '+ y +'</div>'+
																			'<span class="jcal-list-month jcal-icon-list" id="jcal-reset_'+id_suffix+'" title="תצוגת רשימה"></span>'+
																		'</div>'+
																		'<div class="jcal-right">'+
																			'<span class="jcal-prev jcal-icon jcal-icon-right-single-arrow" title="חודש קודם"></span>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-list').removeClass('jcal-icon-month').attr("title","תצוגת רשימה");									
								}else{ //listMode
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-month').removeClass('jcal-icon-list').attr("title","תצוגת חודש");								
								}																	
							}
						}else{
							if(options.lang=='en'){
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<button class="jcal-button jcal-corner-left jcal-button-left jcal-icon jcal-icon-left-single-arrow" title="Previous month"></button>'+
																			'<button class="jcal-today-button jcal-button jcal-corner-left jcal-corner-righ">today</button>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+monthNames[m - 1] +' '+ y +'</div>'+
																			'<button class="jcal-month-list-button jcal-button jcal-corner-left jcal-corner-right"/>'+
																		'</div>'+
																		'<div class="jcal-right">'+
																			'<button class="jcal-button jcal-corner-right jcal-button-right jcal-icon jcal-icon-right-single-arrow" title="Next month"></button>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-month-list-button').html('List');
								}else{ //listMode
									$('#'+divId+' .jcal-month-list-button').html('Month');
								}
							}else if(options.lang=='he'){
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<button class="jcal-button jcal-corner-left jcal-button-right jcal-icon jcal-icon-left-single-arrow" title="חודש הבא"></button>'+
																			'<button class="jcal-today-button jcal-button jcal-corner-left jcal-corner-righ ">היום</button>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+monthNames[m - 1] +' '+ y +'</div>'+
																			'<button class="jcal-month-list-button jcal-button jcal-corner-left jcal-corner-right"/>'+
																		'</div>'+
																		'<div class="jcal-right">'+
																			'<button class="jcal-button jcal-corner-right jcal-button-left jcal-icon jcal-icon-right-single-arrow" title="חודש קודם"></button>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-month-list-button').html('רשימה');
								}else{ //listMode
									$('#'+divId+' .jcal-month-list-button').html('חודש');
								}																	
							}							
						}
					}else if(options.cal=='jewish'){
						if(!options.buttons){
							if(options.lang=='en'){
								enMonth = getJewishMonthName(m,y,'en');
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<span class="jcal-prev jcal-icon jcal-icon-left-single-arrow"></span>'+
																			'<span class="jcal-reset jcal-icon-down-triangle" id="jcal-reset_'+id_suffix+'" title="Set to today"></span>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+enMonth +' '+ y +'</div>'+
																			'<span class="jcal-list-month jcal-icon-list" id="jcal-reset_'+id_suffix+'" title="List view"></span>'+
																		'</div>'+
																		'<div class="jcal-right">'+
																			'<span class="jcal-next jcal-icon jcal-icon-right-single-arrow"></span>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-list').removeClass('jcal-icon-month').attr("title","List view");									
								}else{ //listMode
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-month').removeClass('jcal-icon-list').attr("title","Month view");								
								}																		
							}else if(options.lang=='he'){
								jYear = latin2hebrew.format(y);
								jMonth = getJewishMonthName(m,y,'he');					
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<span class="jcal-next jcal-icon jcal-icon-left-single-arrow" title="חודש הבא"></span>'+
																			'<span class="jcal-reset jcal-icon-down-triangle" id="jcal-reset_'+id_suffix+'" title="חזור לחודש הנוכחי"></span>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+jMonth +' ה'+ jYear +'</div>'+
																			'<span class="jcal-list-month jcal-icon-list" id="jcal-reset_'+id_suffix+'" title="תצוגת רשימה"></span>'+
																		'</div>'+
																		'<div class="jcal-right">'+
																			'<span class="jcal-prev jcal-icon jcal-icon-right-single-arrow" title="חודש קודם"></span>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-list').removeClass('jcal-icon-month').attr("title","תצוגת רשימה");									
								}else{ //listMode
									$('#'+divId+' .jcal-list-month').addClass('jcal-icon-month').removeClass('jcal-icon-list').attr("title","תצוגת חודש");								
								}																		
							}
						}else{
							if(options.lang=='en'){
								enMonth = getJewishMonthName(m,y,'en');
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<button class="jcal-button jcal-corner-left jcal-button-left jcal-icon jcal-icon-left-single-arrow" title="Previous month"></button>'+
																			'<button class="jcal-today-button jcal-button jcal-corner-left jcal-corner-righ ">today</button>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+enMonth +' '+ y +'</div>'+
																			'<button class="jcal-month-list-button jcal-button jcal-corner-left jcal-corner-right"/>'+
																		'</div>'+																		
																		'<div class="jcal-right">'+
																			'<button class="jcal-button jcal-corner-right jcal-button-right jcal-icon jcal-icon-right-single-arrow" title="Next month"></button>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-month-list-button').html('List');
								}else{ //listMode
									$('#'+divId+' .jcal-month-list-button').html('Month');
								}																		
							}else if(options.lang=='he'){
								jYear = latin2hebrew.format(y);
								jMonth = getJewishMonthName(m,y,'he');					
								$('#' + divId + ' .jcal-toolbar').html('<div class="jcal-left">'+
																			'<button class="jcal-button jcal-corner-left jcal-button-right jcal-icon jcal-icon-left-single-arrow" title="חודש הבא"></button>'+
																			'<button class="jcal-today-button jcal-button jcal-corner-left jcal-corner-righ ">היום</button>'+
																		'</div>'+
																		'<div class="jcal-center">'+
																			'<div class="jcal-toolbar-title-date" id="jcal-toolbar-title-date_'+id_suffix+'">'+jMonth +' ה'+ jYear +'</div>'+
																			'<button class="jcal-month-list-button jcal-button jcal-corner-left jcal-corner-right"/>'+
																		'</div>'+																			
																		'<div class="jcal-right">'+
																			'<button class="jcal-button jcal-corner-right jcal-button-left jcal-icon jcal-icon-right-single-arrow" title="חודש קודם"></button>'+
																		'</div>');
								if(viewMode == 'monthMode'){
									$('#'+divId+' .jcal-month-list-button').html('רשימה');
								}else{ //listMode
									$('#'+divId+' .jcal-month-list-button').html('חודש');
								}																		
							}
							
						}
					}
					
				}

				// Account for empty days at start
				if(firstDay != 7) {
					for(var i = 0; i < firstDay; i++) {
						$('#' + divId + ' .jcal-day-wrap').prepend('<div class="jcals jcal-day-blank" id="jcal-day-blank_'+id_suffix+'"><div class="jcal-day-number"></div></div>');
					}
				}

				//Account for empty days at end
				var numdays = $('#' + divId + ' .jcal-day').length,
					numempty = $('#' + divId + ' .jcal-day-blank').length,
					totaldays = numdays + numempty,
					roundup = Math.ceil(totaldays/7) * 7,
					daysdiff = roundup - totaldays;
				if(totaldays % 7 != 0) {
					for(var i = 0; i < daysdiff; i++) {
						$('#' + divId + ' .jcal-day-wrap').append('<div class="jcals jcal-day-blank"  id="jcal-day-blank_'+id_suffix+'"><div class="jcal-day-number"></div></div>');
					}
				}

				// Remove previous events
				// Add Events
				var addEvents = function(event) {
					// Year [0]   Month [1]   Day [2]
					if(options.dataType=='xml'){
						var fullstartDate = $(event).find('startdate').text(),
							startArr = fullstartDate.split("-"),
							startYear = startArr[0],
							startMonth = parseInt(startArr[1], 10),
							startDay = parseInt(startArr[2], 10),
							fullendDate = $(event).find('enddate').text(),
							endArr = fullendDate.split("-"),
							endYear = endArr[0],
							endMonth = parseInt(endArr[1], 10),
							endDay = parseInt(endArr[2], 10),
							eventURL = $(event).find('url').text(),
							eventTitle = $(event).find('name').text(),
							eventTtype = $(event).find('type').text(),
							eventBgColor = $(event).find('bgcolor').text(),
							eventColor = $(event).find('color').text(),
							eventId = $(event).find('id').text(),
							startTime = $(event).find('starttime').text(),
							startSplit = startTime.split(":"),
							endTime = $(event).find('endtime').text(),
							endSplit = endTime.split(":"),
							eventLink = '',
							startPeriod = 'AM',
							endPeriod = 'AM',
							startTime24 = startTime,
							endTime24 = endTime;
					}else if(options.dataType=='php' || options.dataType=='json'){
						var fullstartDate = event.startdate,
							startArr = fullstartDate.split("-"),
							startYear = startArr[0],
							startMonth = parseInt(startArr[1], 10),
							startDay = parseInt(startArr[2], 10),
							fullendDate =  event.enddate,
							endArr = fullendDate.split("-"),
							endYear = endArr[0],
							endMonth = parseInt(endArr[1], 10),
							endDay = parseInt(endArr[2], 10),
							eventURL = event.url,
							eventTitle = event.name,
							eventTtype = event.type,
							eventBgColor = event.bgcolor,
							eventColor = event.color,
							eventId = event.id,
							startTime = event.starttime,
							startSplit = startTime.split(":"),
							endTime = event.endtime,
							endSplit = endTime.split(":"),
							eventLink = '',
							startPeriod = 'AM',
							endPeriod = 'AM',
							startTime24 = startTime,
							endTime24 = endTime;
					}
					/* Convert times to 12 hour & determine AM or PM */
					if(parseInt(startSplit[0]) >= 12) {
						var startTime = (startSplit[0] - 12)+':'+startSplit[1]+'';
						var startPeriod = 'PM';
					}

					if(parseInt(startTime) == 0) {
						var startTime = '12:'+startSplit[1]+'';
					}

					if(parseInt(endSplit[0]) >= 12) {
						var endTime = (endSplit[0] - 12)+':'+endSplit[1]+'';
						var endPeriod = 'PM';
					}
					if(parseInt(endTime) == 0) {
						var endTime = '12:'+endSplit[1]+'';
					}
					if (eventURL){
						var eventLink = 'href="'+eventURL+'"';
					}

					// function to print out list for multi day events
					function multidaylist(){
						var timeHtml = '';
						if(options.timeFormat=='12h'){
							if (startTime){
								var startTimehtml = '<div><div class="jcal-list-time-start">'+startTime+' '+startPeriod+'</div>';
								var endTimehtml = '';
								if (endTime){
									var endTimehtml = '<div class="jcal-list-time-end">'+endTime+' '+endPeriod+'</div>';
								}
								var timeHtml = startTimehtml + endTimehtml + '</div>';
							}
						}else{ //24h
							if (startTime){
								var startTimehtml = '<div><div class="jcal-list-time-start">'+startTime24+'</div>';
								var endTimehtml = '';
								if (endTime){
									var endTimehtml = '<div class="jcal-list-time-end">'+endTime24+'</div>';
								}
								var timeHtml = startTimehtml + endTimehtml + '</div>';
							}
						}
						if(options.lang=='en'){
							$('#'+divId+' .jcal-list-item[data-number="'+i+'"]').addClass('item-has-event').append('<a href="'+eventURL+'" class="listed-event" id="listed-event-'+eventTtype+'"  data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+' '+timeHtml+'</a>');
						}else if(options.lang=='he'){
							$('#'+divId+' .jcal-list-item-rtl[data-number="'+i+'"]').addClass('item-has-event').append('<a href="'+eventURL+'" class="listed-event" id="listed-event-'+eventTtype+'"  data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+' '+timeHtml+'</a>');
						}
					}


					// If event is one day & within month
					if (!fullendDate && startMonth == setMonth && startYear == setYear) {
						// Add Indicators
						//add count
						var old_count = $('#'+divId+' *[data-number="'+startDay+'"] #jcal-events-counter-'+startDay).data('count');
						var new_count = Number(old_count)+1;
						$('#'+divId+' *[data-number="'+startDay+'"] #jcal-events-counter-'+startDay).data('count',new_count);
						$('#'+divId+' *[data-number="'+startDay+'"] #jcal-events-counter-'+startDay).attr('data-count',new_count);						
						if (old_count < Number(options.eventNum)){
							$('#'+divId+' *[data-number="'+startDay+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'"  data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');							
						}else{
							var hide_count = new_count - Number(options.eventNum);
							var hide_count_txt;
							if(options.lang=="en"){
								hide_count_txt = hide_count+' more...';
							}else if(options.lang=="he"){
								hide_count_txt = 'עוד '+hide_count+'...';
							}
							$('#'+divId+' *[data-number="'+startDay+'"] .jcal-more-events').html(hide_count_txt).show();
						}
						// Print out event list for single day event
						var timeHtml = '';
						if (startTime){
							var startTimehtml = '<div><div class="jcal-list-time-start">'+startTime+' '+startPeriod+'</div>';
							var endTimehtml = '';
							if (endTime){
								var endTimehtml = '<div class="jcal-list-time-end">'+endTime+' '+endPeriod+'</div>';
							}
							var timeHtml = startTimehtml + endTimehtml + '</div>';
						}
						if(options.lang=='en'){
							$('#'+divId+' .jcal-list-item[data-number="'+startDay+'"]').addClass('item-has-event').append('<a href="'+eventURL+'" class="listed-event" id="listed-event-'+eventTtype+'"  data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'"  title="'+eventTitle+'">'+eventTitle+' '+timeHtml+'</a>');
						}else if(options.lang=='he'){
							$('#'+divId+' .jcal-list-item-rtl[data-number="'+startDay+'"]').addClass('item-has-event').append('<a href="'+eventURL+'" class="listed-event" id="listed-event-'+eventTtype+'"  data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+' '+timeHtml+'</a>');
						}
						// If event is multi day & within month
					} else if (startMonth == setMonth && startYear == setYear && endMonth == setMonth && endYear == setYear){
						for(var i = parseInt(startDay); i <= parseInt(endDay); i++) {
							// If first day, add title
							if (i == parseInt(startDay)) {
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									var hide_count_txt;
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}										
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();									
								}
							} else {
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									var hide_count_txt;
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}							
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();																		
								}
							}
							multidaylist();
						}

						// If event is multi day, starts in prev month, and ends in current month
					} else if ((endMonth == setMonth && endYear == setYear) && ((startMonth < setMonth && startYear == setYear) || (startYear < setYear))) {
						for(var i = 0; i <= parseInt(endDay); i++) {
							// If first day, add title
							if (i==1){
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();																		
								}								
							} else {
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();																		
								}								
							}
							multidaylist();
						}

						// If event is multi day, starts in this month, but ends in next
					} else if ((startMonth == setMonth && startYear == setYear) && ((endMonth > setMonth && endYear == setYear) || (endYear > setYear))){
						for(var i = parseInt(startDay); i <= dayQty; i++) {
							// If first day, add title
							if (i == parseInt(startDay)) {
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);	
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();																		
								}								
							} else {
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);	
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();									
									
								}								
							}
							multidaylist();
						}

						// If event is multi day, starts in a prev month, ends in a future month
					} else if (((startMonth < setMonth && startYear == setYear) || (startYear < setYear)) && ((endMonth > setMonth && endYear == setYear) || (endYear > setYear))){
						for(var i = 0; i <= dayQty; i++) {
							// If first day, add title
							if (i == 1){
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();																		
								}								
							} else {
								//add count
								var old_count = $('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count');
								var new_count = Number(old_count)+1;
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).data('count',new_count);
								$('#'+divId+' *[data-number="'+i+'"] #jcal-events-counter-'+i).attr('data-count',new_count);
								if (old_count < Number(options.eventNum)){
									$('#'+divId+' *[data-number="'+i+'"] .jcal-indicator-wrap').append('<div class="jcal-event-indicator" id="jcal-event-indicator-'+eventTtype+'" data-eventid="'+ eventId +'" style="background:'+eventBgColor+';color:'+eventColor+'" title="'+eventTitle+'">'+eventTitle+'</div>');
								}else{
									var hide_count = new_count - Number(options.eventNum);
									if(options.lang=="en"){
										hide_count_txt = hide_count+' more...';
									}else if(options.lang=="he"){
										hide_count_txt = 'עוד '+hide_count+'...';
									}
									$('#'+divId+' *[data-number="'+i+'"] .jcal-more-events').html(hide_count_txt).show();																		
								}								
							}
							multidaylist();
						}

					}
				};
				if(options.dataType=='xml' || options.dataType=='json'){
					$.get(''+options.url+'', {now: jQuery.now()}, function(d){
						if (options.dataType == 'xml') {
							$(d).find('event').each(function(index, event) {
								addEvents(event);
							});
						} else if (options.dataType == 'json') {
							$.each(d.jcal, function(index, event) {
								addEvents(event);
							});
						}
					}, options.dataType).fail(function() {
						console.error('Jcal.js failed to import '+options.url+'. Please check for the correct path & '+options.dataType+' syntax.');
					});
				}else if(options.dataType=='php'){
					//////////////////////joomla Platform format//////////////////
					if(options.phpPlatform=='joomla'){
						var request = {
							'option' : 'com_ajax',
							'module' : options.moduleName, /*joomla module name without 'mod_'*/
							'data'   : m+'AND'+y, /*send here m (month)'AND' y(year)*/
							'method' :'getCreateJson',
							'format' : 'raw'
						};
						jQuery.ajax({
							type   : 'POST',
							data   : request,
							success: function (d) { /*d return events list in json format*/
								//alert(d);
								var obj = jQuery.parseJSON(d);//convert json strint to json object 
								$.each(obj.jcal, function(index, event) {
									addEvents(event);
								});									
							}
						});
					}else{
						jQuery.ajax({
							type   	: 'POST',
							url		: options.url, 
							data   	: m+'AND'+y,
							success	: function (d) {
								//alert(d);
								var obj = jQuery.parseJSON(d);//convert json strint to json object 
								$.each(obj.jcal, function(index, event) {
									addEvents(event);
								});									
							}
						});							
					}
				}
				var divs = $("#"+divId+" .jcals");
				var j=1;
				for(var i = 0; i < divs.length; i+=7) {
				  divs.slice(i, i+7).wrapAll("<div class='jcal-week' data-week='"+j+"'></div>");
				  j++;
				}
				//add jQuery-ui classes
				if (options.jQueryui){
					$('#'+divId).addClass('ui-widget');
					//month view
					//header
					$('#'+divId+' .jcal-header').addClass('ui-widget-header');
					$('#'+divId+' .jcal-day-title-wrap').addClass('ui-widget-header');
					
					//buttons
					if(options.lang=='en'){
						$('#'+divId+' .jcal-button-right').addClass('ui-button ui-corner-right');
						$('#'+divId+' .jcal-button-left').addClass('ui-button ui-corner-left');
					}else if(options.lang=='he'){
						$('#'+divId+' .jcal-button-right').addClass('ui-button ui-corner-left');
						$('#'+divId+' .jcal-button-left').addClass('ui-button ui-corner-right');						
					}
					$('#'+divId+' .jcal-today-button').addClass('ui-button ui-corner-right ui-corner-left');
					$('#'+divId+' .jcal-reset').addClass('ui-widget-header ui-corner-right ui-corner-left');
					$('#'+divId+' .jcal-reset').removeClass('jcal-spcl-icon');
					$('#'+divId+' .jcal-list-month').addClass('ui-widget-header ui-corner-right ui-corner-left');
					$('#'+divId+' .jcal-list-month').removeClass('jcal-spcl-icon');
					$('#'+divId+' .jcal-month-list-button').addClass('ui-button ui-corner-left ui-corner-right');
					if (m == currentMonth && y == currentYear){
						$('#'+divId+' .jcal-today-button').addClass('ui-state-disabled');
					}				
					//content
					$('#'+divId+' .jcal-day').addClass('ui-widget-content');
					//$('#'+divId+' .jcal-day-blank').addClass('ui-widget-content');
					
					//list view
					$('#'+divId+' .jcal-list-item').addClass('ui-widget-content');
				}				
				
			}
			// Set the calendar the first time
			if (options.monthToView==false){
				setJcalMonth(currentMonth, currentYear);
			}else{
				setJcalMonth(options.monthToView[0], options.monthToView[1]);
			}
				
			function getJewishMonthName(jm,jy,l){
				var jm_en = ["Tishrei","Cheshvan","Kislev","Tevet","Shevat","","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul"];
				var jm_en_leap = ["Tishrei","Cheshvan","Kislev","Tevet","Shevat","Adar A","Adar B","Nisan","Iyar","Sivan","Tamuz","Av","Elul"];
				var jm_he = ["תשרי","חשוון","כסלו","טבת","שבט","","אדר","ניסן","אייר","סיוון","תמוז","אב","אלול"];
				var jm_he_leap = ["תשרי","חשוון","כסלו","טבת","שבט","אדר א'","אדר ב'","ניסן","אייר","סיוון","תמוז","אב","אלול"];
				var isleap = leapYear(jy);
				if(l=="en" && isleap){
					return jm_en_leap[Number(jm)-1];
				}else if(l=="en" && !isleap){
					return jm_en[Number(jm)-1];
				}else if(l=="he" && isleap){
					return jm_he_leap[Number(jm)-1];
				}else if(l=="he" && !isleap){
					return jm_he[Number(jm)-1];
				}
			}

			// Advance months
			function leapYear(yH) {
				var c = yH%19;
				return (c==3||c==6||c==8||c==11||c==14||c==17||c==0);
			}
			//cheke if day is Shabat
			function isShabat(dY,dM,dD){
				var dayNum, dCal = options.cal;
				if(dCal=='gre'){
					dayNum = new Date(Number(dY), Number(dM), Number(dD)).getDay();
					if(dayNum==6){
						return true;
					}else{
						return false;
					}
				}else if(dCal=='jewish'){
					var je2gre = HebToGreg(Number(dY), Number(dM), Number(dD));
					var jeObj = new GregToHeb(je2gre);
					dayNum = jeObj.day;					
					if(dayNum==6){
						return true;
					}else{
						return false;
					}					
				}
			}
			function weeksinMonth(y,m,d){
				var date = new Date(y,m-1,d);
				var firstDay = new Date(y, m-1, 1).getDay();
				return Math.ceil((date.getDate() + firstDay)/7);  
			}
			function weeksinMonthJewish(jy,jm,jd){
				//the week day of the first day of the month
				var he2grefirstDay = HebToGreg(jy, jm, 1);
				var jedObjfirstDay = new GregToHeb(he2grefirstDay);
				var firstDay= jedObjfirstDay.day;
				//the date of input date (1-31)
				var he2gre = HebToGreg(jy, jm, jd);
				var jedObj = new GregToHeb(he2gre);
				var dayNamenum = jedObj.d;
				return Math.ceil((dayNamenum + firstDay)/7);  
			}			
			function goNextMonth(clndr){ 
				var setMonth = $('#' + divId).data('setMonth'),
					setYear = $('#' + divId).data('setYear');
				if(clndr=='jewish'){
					var isLeap = leapYear(setYear);
					if (setMonth == 13) {
						var newMonth = 1,
							newYear = setYear + 1;
						setJcalMonth(newMonth, newYear);
					}else if(setMonth == 5 && !isLeap) { //skip adar1 in none leap year
						var newMonth = setMonth + 2,
							newYear = setYear;
						setJcalMonth(newMonth, newYear);
					}else{
						var newMonth = setMonth + 1,
							newYear = setYear;
						setJcalMonth(newMonth, newYear);				
					}					
				}else if(clndr=='gre'){
					if (setMonth == 12) {
						var newMonth = 1,
							newYear = setYear + 1;
						setJcalMonth(newMonth, newYear);
					} else {
						var newMonth = setMonth + 1,
							newYear = setYear;
						setJcalMonth(newMonth, newYear);
					}
				}
			}
			$(document.body).on('click', '#'+divId+' .jcal-next', function (e) {
				goNextMonth(options.cal);
				e.preventDefault(options.cal);
			});	
			$(document.body).on('click', '#'+divId+' .jcal-button-right', function (e) {
				goNextMonth(options.cal);
			});		
			// Go back in months
			function goBackMonth(clndr){
				var setMonth = $('#' + divId).data('setMonth'),
					setYear = $('#' + divId).data('setYear');
				if(clndr=='jewish'){	
					var isLeap = leapYear(setYear);
					if (setMonth == 1) {
						var newMonth = 13,
							newYear = setYear - 1;
						setJcalMonth(newMonth, newYear);
					}else if(setMonth == 7 && !isLeap){
						var newMonth = setMonth - 2,
							newYear = setYear;
						setJcalMonth(newMonth, newYear);				
					} else {
						var newMonth = setMonth - 1,
							newYear = setYear;
						setJcalMonth(newMonth, newYear);
					}
				}else if(clndr=='gre'){
					if (setMonth == 1) {
						var newMonth = 12,
							newYear = setYear - 1;
						setJcalMonth(newMonth, newYear);
					} else {
						var newMonth = setMonth - 1,
							newYear = setYear;
						setJcalMonth(newMonth, newYear);
					}
				}			
			}
			function view_day_evente(day,title){
				$('#' + divId+' .jcal-event-list').show();
				$('#' + divId+' .jcal-event-list').css('transform');
				$('#' + divId+' .jcal-event-list').css('transform','scale(1)');
				if(options.lang=='en'){
					$('#' + divId+' .jcal-list-item').hide();
				}else if(options.lang=='he'){
					$('#' + divId+' .jcal-list-item-rtl').hide();
				}
				$('#' + divId+'day'+day).show();
				if(options.buttons){
					$('#'+divId+' .jcal-month-list-button').html(title);
				}else{
					$('#'+divId+' .jcal-list-month').addClass('jcal-icon-month').removeClass('jcal-icon-list').attr("title",title);
				}
				
				
				//hide left and right buttons
				$('#'+divId+' .jcal-right').hide();
				$('#'+divId+' .jcal-left').hide();				
			}
			$(document.body).on('click', '#'+divId+' .jcal-prev', function (e) {
				goBackMonth(options.cal);
				e.preventDefault();
			});
			$(document.body).on('click', '#'+divId+' .jcal-button-left', function (e) {
				goBackMonth(options.cal);
			});			
			// Reset Month
			$(document.body).on('click', '#'+divId+' .jcal-reset', function (e) {
				$('#'+divId+' .jcal-reset').remove();
				setJcalMonth(currentMonth, currentYear);
				e.preventDefault();
				e.stopPropagation();
			});
			//TO Day
			$(document.body).on('click', '#'+divId+' .jcal-today-button', function (e) {
				$('#'+divId+' .jcal-today-button').addClass('jcal-state-default jcal-state-disabled').attr('disabled','disabled');
				setJcalMonth(currentMonth, currentYear);
				
			});
			// Click A Day
			$(document.body).on('click', '#'+divId+' a.jcal-day', function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			$(document.body).on('click','#'+divId+' .jcal-event-indicator', function (e) { //
				// If events, show events list
				var dayNum = $(this).parent().parent().data('number');//jcal-day
				var m_title;
				if(options.buttons){
					if(options.lang=='en'){
						m_title = "Month";
					}else if(options.lang=='he'){
						m_title = "חודש";
					}					
				}else{
					if(options.lang=='en'){
						m_title = "Month view";
					}else if(options.lang=='he'){
						m_title = "תצוגת חודש";
					}					
				}
				view_day_evente(dayNum,m_title);
				viewMode = 'listMode';
			});	
			$(document.body).on('click','#'+divId+' .jcal-more-events', function (e) { //
				// If events, show events list
				var dayNum = $(this).parent().data('number');//jcal-day
				var m_title;
				if(options.buttons){
					if(options.lang=='en'){
						m_title = "Month";
					}else if(options.lang=='he'){
						m_title = "חודש";
					}					
				}else{
					if(options.lang=='en'){
						m_title = "Month view";
					}else if(options.lang=='he'){
						m_title = "תצוגת חודש";
					}					
				}

				view_day_evente(dayNum,m_title);
				viewMode = 'listMode';
			});				
			if(options.buttons){
				$(document.body).on('click','#'+divId+' .jcal-month-list-button', function (e) { 
					// If events, show events list
					if(viewMode == 'monthMode'){
						viewMode = 'listMode';
						var whichDay = $(this).parent().parent().data('number');//jcal-day
						$('#' + divId+' .jcal-event-list').show();
						$('#' + divId+' .jcal-event-list').css('transform');
						$('#' + divId+' .jcal-event-list').css('transform','scale(1)');
						$('#' + divId+' .item-has-event').show();
						var text_month = "";
						if(options.lang=='en'){
							text_month = "Month";
						}else if(options.lang=='he'){
							text_month = "חודש";
						}						
						$('#'+divId+' .jcal-month-list-button').html(text_month);
					}else{//listMode
						viewMode = 'monthMode';
						$('#' + divId+' .jcal-event-list').css('transform','scale(0)');
						setTimeout(function(){
							$('#' + divId+' .jcal-event-list').hide();
						}, 250);
						var text_list = "";
						if(options.lang=='en'){
							text_list = "List";
						}else if(options.lang=='he'){
							text_list = "רשימה";
						}						
						$('#'+divId+' .jcal-month-list-button').html(text_list)						
						//show left and right buttons
						$('#'+divId+' .jcal-right').show();
						$('#'+divId+' .jcal-left').show();						
					}					
				});
			}else{
				$(document.body).on('click','#'+divId+' .jcal-list-month', function (e) { 
					// If events, show events list
					if(viewMode == 'monthMode'){
						viewMode = 'listMode';
						var whichDay = $(this).parent().parent().data('number');//jcal-day
						$('#' + divId+' .jcal-event-list').show();
						$('#' + divId+' .jcal-event-list').css('transform');
						$('#' + divId+' .jcal-event-list').css('transform','scale(1)');
						
						var title_month = "";
						if(options.lang=='en'){
							title_month = "Month view";
						}else if(options.lang=='he'){
							title_month = "תצוגת חודש";
						}
						$('#' + divId+' .item-has-event').show();						
						$('#'+divId+' .jcal-list-month').addClass('jcal-icon-month').removeClass('jcal-icon-list').attr("title",title_month);	
						
					}else{ //listMode
						viewMode = 'monthMode';
						$('#' + divId+' .jcal-event-list').css('transform','scale(0)');
						setTimeout(function(){
							$('#' + divId+' .jcal-event-list').hide();
						}, 250);
						var title_list = "";
						if(options.lang=='en'){
							title_list = "List view";
						}else if(options.lang=='he'){
							title_list = "תצוגת רשימה";
						}						
						$('#'+divId+' .jcal-list-month').addClass('jcal-icon-list').removeClass('jcal-icon-month').attr("title",title_list);
						//show left and right buttons
						$('#'+divId+' .jcal-right').show();
						$('#'+divId+' .jcal-left').show();						
					}
				});
			}

			// Clicking an event within the list
			$(document.body).on('click', '#'+divId+' .listed-event', function (e) {
				var href = $(this).attr('href');
				// If there isn't a link, don't go anywhere
				if(!href) {
					e.preventDefault();
				}
			});
			//////////////////Colors//////////////////
			if(!options.jQueryui){
				$('#'+divId+' .jcal-header').css({
					'background':options.calTitleBgcolor,
					'color':options.calTitleTxtcolor,
					'font-size':options.calTitleFontSize
				});											
				$('#'+divId+' .jcal-day-title-wrap').css({
					'background':options.weekdaysBgcolor,
					'color':options.weekdaysTxtcolor,
					'font-size':options.weekdaysFontSize
				});
				$('#'+divId+' #jcal-day_'+id_suffix).css({
					'background':options.daysBgcolor,
					'color':options.daysTxtcolor,
					'font-size':options.daysFontSize
				});
									
				$('#'+divId+' #jcal-day_'+id_suffix+'_isShabat').css({
					'background':options.shabatDaysBgcolor,
					'color':options.shabatDaysTxtcolor,
					'font-size':options.shabatDaysFontSize
				});
									
				$('#'+divId+' .jcal-day-blank').css({'background':options.blankDaysBgcolor});			
			}
			//////////////////////////////////////////
			
			function archaicNumbers(arr){
				var arrParse = arr.slice().sort(function (a,b) {return b[1].length - a[1].length});
				return {
					format: function(n){
						var ret = '';
						jQuery.each(arr, function(){
							var num = this[0];
							if (parseInt(num) > 0){
								for (; n >= num; n -= num) ret += this[1];
							}else{
								ret = ret.replace(num, this[1]);
							}
						});
						return ret; 
					}
				}
			}

			function MonSinceFirstMolad(nYearH) {
				var nMonSinceFirstMolad;
				nYearH --
				nMonSinceFirstMolad = Math.floor(nYearH / 19) * 235;
				nYearH = nYearH % 19;
				nMonSinceFirstMolad += 12 * nYearH;
				if (nYearH >= 17) {
					nMonSinceFirstMolad += 6;
				} else if  (nYearH >= 14) {
					nMonSinceFirstMolad += 5;
				} else if  (nYearH >= 11) {
					nMonSinceFirstMolad += 4;
				} else if  (nYearH >= 8) {
					nMonSinceFirstMolad += 3;
				} else if  (nYearH >= 6) {
					nMonSinceFirstMolad += 2;
				} else if  (nYearH >= 3) {
					nMonSinceFirstMolad += 1;
				}
				return nMonSinceFirstMolad;
			}

			function Tishrei1(nYearH) {
				var nMonthsSinceFirstMolad;
				var nChalakim;
				var nHours;
				var nDays;
				var nDayOfWeek;
				var dTishrei1;

				nMonthsSinceFirstMolad = MonSinceFirstMolad(nYearH);
				nChalakim = 793 * nMonthsSinceFirstMolad;
				nChalakim += 204;
				nHours = Math.floor(nChalakim / 1080);
				nChalakim = nChalakim % 1080;

				nHours += nMonthsSinceFirstMolad * 12;
				nHours += 5;

				nDays = Math.floor(nHours / 24);
				nHours = nHours % 24;

				nDays += 29 * nMonthsSinceFirstMolad;
				nDays += 2;
				nDayOfWeek = nDays % 7;

				if (!leapYear(nYearH) &&  nDayOfWeek == 3 &&(nHours * 1080) + nChalakim >= (9 * 1080) + 204) {
				  nDayOfWeek = 5;
				  nDays += 2;
				}
				else if ( leapYear(nYearH - 1) && nDayOfWeek == 2 && (nHours * 1080) + nChalakim >= (15 * 1080) + 589 ) {
				  nDayOfWeek = 3;
				  nDays += 1;
				}
				else {
				  if (nHours >= 18) {
					nDayOfWeek += 1;
					nDayOfWeek = nDayOfWeek % 7;
					nDays += 1;
				  }
				  if (nDayOfWeek == 1 ||nDayOfWeek == 4 || nDayOfWeek == 6) {
					nDayOfWeek += 1;
					nDayOfWeek = nDayOfWeek % 7;
					nDays += 1;
				  }
				}

				nDays -= 2067025;
				dTishrei1 = new Date(1900, 0, 1);
				dTishrei1.setDate(dTishrei1.getDate() + nDays);

				return dTishrei1;
			}

			function LengthOfYear(nYearH) {
				var dThisTishrei1;
				var dNextTishrei1;
				var diff;

				dThisTishrei1 = Tishrei1(nYearH);
				dNextTishrei1 = Tishrei1(nYearH + 1);

				diff = (dNextTishrei1 - dThisTishrei1) / ( 1000 * 60 * 60 * 24);
				return Math.round(diff);
			}

			function HebToGreg(nYearH, nMonthH, nDateH) {
				var nLengthOfYear;
				var bLeap;
				var dGreg;
				var nMonth;
				var nMonthLen;
				var bHaser;
				var bShalem;

				bLeap = leapYear(nYearH);
				nLengthOfYear = LengthOfYear(nYearH);

				bHaser = (nLengthOfYear == 353 || nLengthOfYear == 383);
				bShalem = (nLengthOfYear == 355 || nLengthOfYear == 385);

				dGreg = Tishrei1(nYearH)
				for (nMonth = 1; nMonth <= nMonthH - 1; nMonth ++) {
					if (nMonth == 1 || nMonth == 5 || nMonth == 8 || nMonth == 10 || nMonth == 12 ) {
						nMonthLen = 30;
					} else if (nMonth == 4 || nMonth == 7 || nMonth == 9 || nMonth == 11 || nMonth == 13 ) {
						nMonthLen = 29;
					} else if (nMonth == 6) {
						nMonthLen = (bLeap ? 30 : 0);
					} else if (nMonth == 2) {
						nMonthLen = (bShalem ? 30 : 29);
					} else if (nMonth == 3) {
						nMonthLen = (bHaser ? 29 : 30 );
					}
					dGreg.setDate(dGreg.getDate() + nMonthLen);
				}
				dGreg.setDate(dGreg.getDate() + nDateH - 1);
				return dGreg;
			}

			function GregToHeb(dGreg) {
				var nYearH;
				var nMonthH;
				var nDateH;
				var nOneMolad;
				var nAvrgYear;
				var nDays;
				var dTishrei1;
				var nLengthOfYear;
				var bLeap;
				var bHaser;
				var bShalem;
				var nMonthLen;
				var bWhile;
				var d1900 = new Date(1900, 0, 1);

				nOneMolad = 29 + (12 / 24) + (793 / (1080 * 24));
				nAvrgYear = nOneMolad * (235 / 19);

				nDays = Math.round((dGreg - d1900) / (24 * 60 * 60 * 1000));
				nDays += 2067025;
				nYearH = Math.floor(nDays / nAvrgYear) + 1;
				dTishrei1 = Tishrei1(nYearH);

				if (SameDate(dTishrei1, dGreg)) {
					nMonthH = 1;
					nDateH = 1;
				}
				else  {
					if (dTishrei1 < dGreg) {
						while (Tishrei1(nYearH + 1) <= dGreg) {
							nYearH += 1;
						}
					}else {
						nYearH -= 1;
						while (Tishrei1(nYearH) > dGreg) {
							nYearH -= 1;
						}
					}
					nDays = (dGreg - Tishrei1(nYearH)) / (24 * 60 * 60 * 1000);
					nDays = Math.round(nDays);
					nLengthOfYear = LengthOfYear(nYearH);
					bHaser = nLengthOfYear == 353 || nLengthOfYear == 383;
					bShalem = nLengthOfYear == 355 || nLengthOfYear == 385;
					bLeap = leapYear(nYearH);
					nMonthH = 1;
					do{
						switch (nMonthH) {
							case 1:
							case 5:
							case 6:
							case 8:
							case 10:
							case 12:
								nMonthLen = 30;
								break
							case 4:
							case 7:
							case 9:
							case 11:
							case 13:
								nMonthLen = 29;
								break
							case 6: 
								nMonthLen = 30;
								break
							case 2:
								nMonthLen = (bShalem ? 30 : 29);
								break
							case 3:
								nMonthLen = (bHaser ? 29: 30);
								break
						}

						if (nDays >= nMonthLen) {
							bWhile = true;
							if (bLeap || nMonthH != 5) {
								nMonthH ++;
							}else {
								nMonthH += 2;
							}
							nDays -= nMonthLen;
						}else {
							bWhile = false;
						}
					} while (bWhile)
					nDateH = nDays + 1;
				}
				var day = dGreg.getDay();
				return {
					d: nDateH,
					m: nMonthH,
					y: nYearH,
					day:day
				};	
			}

			function SameDate(d1, d2) {
				return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate())
					 
			} 
			function HeMonthLen(nYearH, nMonthH) {
				var nLengthOfYear;
				var bLeap;
				var nMonthLen;
				var bHaser;
				var bShalem;

				bLeap = leapYear(nYearH);
				nLengthOfYear = LengthOfYear(nYearH);

				bHaser = (nLengthOfYear == 353 || nLengthOfYear == 383);
				bShalem = (nLengthOfYear == 355 || nLengthOfYear == 385);

				if (nMonthH == 1 || nMonthH == 5 || nMonthH == 8 || nMonthH == 10 || nMonthH == 12 ){
					nMonthLen = 30;
				} else if (nMonthH == 4 || nMonthH == 7 || nMonthH == 9 || nMonthH == 11 || nMonthH == 13 ){
					nMonthLen = 29;
				} else if (nMonthH == 6){
					nMonthLen = (bLeap ? 30 : 0);
				} else if (nMonthH == 2){
					nMonthLen = (bShalem ? 30 : 29);
				} else if (nMonthH == 3){
					nMonthLen = (bHaser ? 29 : 30 );
				}
				return nMonthLen;
			}  
			
		}
	});
})(jQuery);
