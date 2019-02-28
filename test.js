// JavaScript Document
var StudyURL = "/study/ajax.php";
var countTimeDelay=180*1000;// Ĭ�ϼ�ʱ��� 1����
var PopWinTime = 1200; //����ȷ�Ͽ�ʱ�� ��λ��
//var PopWinTime = 30; //����ȷ�Ͽ�ʱ�� ��λ��
var effectComTime = 300;//��λ��--������ȷ��ʱ��������
var isCloseFlag = false;
var isSleep = true;//�Ƿ���˯����
var sleepTime = 0;//ֹͣʱ��
var timeOutObj = null;//��ʱ��ʱ��
var countCourseTime = null;//���ż�ʱ��
var isPassTime = false;//�Ƿ�ʱ��
function caclogid(){
}

//������ʱ��־
function createlogid(){
	$.ajax({
			type: "post",
			url: StudyURL,
			data: {act:'insert',courseId:courseid},
			async: false,
			cache: false,
			dataType:'json',
			success:function(data, textStatus){
				if(data.err != 0 ){
					if(data.err==2){
						//window.location.href='/study/login.php'
					}
					window.close();	
					return false;
				}else{
					logId = data.logId;
				}
			},
			error:function(data){
				alert('����ʧ�ܣ�������');
				window.close();
				return false;
			}
		});
}


//��ʼ���ſγ� ��ָ����ʱ�� �����¿γ�
function startPlayCourse()
{
	//����Ѿ�ѧϰ��ɱ��
	del_study_cookie('studyW',0);
	del_study_cookie('studyE',0);
	del_study_cookie('studyS',0);
	del_study_cookie('confirmC',0);
	countCourseTime=setInterval("countCourseTimeFunction()",countTimeDelay);
}


//��¼�¿γ̲���ʱ��
function countCourseTimeFunction(){
	isPassTime =false;
	$.ajax({
			type: "post",
			url: StudyURL,
			data: {act:'update',courseId:courseid,logId:logId},
			async: false,
			cache: false,
			dataType:'json',
			success:function(data, textStatus){
				if(data.err < 0){
					alert(data.msg);
					window.close();
					return false;
				}else if(data.err == '2'){
					alert('�����˺����������ط���¼,��������')
					window.close();
					return false;
				}else if(data.err == '1'){//ѧϰ���
					if(data.examType == 'W'){
						var studyW =get_study_cookie('studyW'); // ��ȡcookie �Ƿ��Ѿ���������ʾ��
						if(studyW != 1){ // û��cookie ˵���ǵ�һ�� ������ʾ��
							set_study_cookie('studyW',1,10);
							//ret=window.confirm('����ѧϰʱ���ѴﵽҪ�󣬻��ѧ��:' + data.credithour + '�Ƿ����ѧϰ');	
							ret=true;
							console.log("����ѧϰ");
							if(!ret){
								window.close();
								return false;
							}
						}
					}else if(data.examType == 'E'){
						var studyE = get_study_cookie('studyE'); // ��ȡcookie �Ƿ��Ѿ���������ʾ��
						if(studyE != 1){ // û��cookie ˵���ǵ�һ�� ������ʾ��
							ret=window.confirm('��������Ա��γ����ݵ���⣬��ɿ����⣡');
							if(ret) {
								window.opener.location.href='/study/exam.php?courseid='+data.courseId;
								window.close();
								return false;
							}else{
								set_study_cookie('studyE',1,10);
							}
						}
					}else if(data.examType == 'S'){
						var studyS = get_study_cookie('studyS'); // ��ȡcookie �Ƿ��Ѿ���������ʾ��
						if(studyS != 1){ // û��cookie ˵���ǵ�һ�� ������ʾ��
							ret=window.confirm('����ѧϰʱ���ѴﵽҪ�󣬿����ύ�ĵá������ύ�ĵ���');
							if(ret) {
								window.opener.location.href='/study/exam_summary.php?act=add&courseid='+data.courseId;
								window.close();
								return false;
							}else{
								set_study_cookie('studyS',1,10);
							}
						}
					}
				}else if(data.err == '0'){//δ���
					var playTime = 0;
					playTime = data.playTime;
					if(playTime > 0 && playTime != null){
						var needPopWin = isPopWin(playTime);
						if(needPopWin){
							updateLastStudyTime(); //��¼�µ�ǰ������ʱ��
							var t =parseInt(effectComTime/60);
							//ret = window.confirm("���Ƿ�Ҫ����ѧϰ? \r\n ����"+t+"����֮�ڵ��ȷ��");
							//alert(countCourseTime)
							window.clearInterval(countCourseTime);//ֹͣ��ʱ��
							sleepTime = 0;//������
							isSleep = true;
							clw().removediv();
							var contents = '<div style="color:#ff0000; text-align: center; height: 100px; margin-top: 20px; font-size: 14px; line-height: 20px;">���Ƿ�Ҫ����ѧϰ? <br /> ����'+t+'����֮�ڵ��ȷ��<p><input type="button" style=" border:1px solid #ccc; margin-top:5px; padding:4px; cursor: pointer;" name="����ѧϰ" value="����ѧϰ" onclick="startLearning();"></p></div><iframe style="width:100%;height:1px;filter:alpha(opacity=0);-moz-opacity:0"></iframe>';
							startLearning();
							//clw().showDialog(300,200,true).setTitle("��ܰ��ʾ",false).setContent(contents);
							//uTimeOut();
							//return false;
						}
					}
				}
				
			},
			error:function(data){
				//alert('��ʱʧ��');
				//window.close();
				//return false;
			}
			
		});
}


function startLearning(){
	clw().removediv();
	isSleep = false;
}

//��ʱ��ʱ��
function uTimeOut(){
	if(isSleep){
		sleepTime++;
		if(sleepTime < (effectComTime+60)){//alert(effectComTime+"==>"+sleepTime)
			timeOutObj = setTimeout(uTimeOut,1000);//ÿ����һ��
			
		}else{
			if (timeOutObj){
                clearTimeout(timeOutObj);
            }
			isStartPlayAgain();
		}
		
	}else{
		if (timeOutObj){
             clearTimeout(timeOutObj);
        }
		isStartPlayAgain();
		
	}
	
}


function closePage(id,time,type){
	sleepTime++;
	//alert(time)
	//alert(document.getElementById(id).innerHTML)
	if(sleepTime < time){//alert(sleepTime)
		document.getElementById(id).innerHTML = time-sleepTime;
		timeOutObj = setTimeout(function(){closePage(id,time,type);},1000);//ÿ����һ��
		
		
	}else{
		if(timeOutObj){
			 clearTimeout(timeOutObj);
		}
		if(type==='close'){
			window.close();//�رմ���
		}else if(type=='checkSelectCourse'){
			checkSelectCourse();
		}
		clw().removediv();
		
	}
}

//�Ƿ�������¿�ʼ����
function isStartPlayAgain(){
	confirmTime = 0;
	sleepTime = 0;
	isPassTime = false;
	if (timeOutObj){
        clearTimeout(timeOutObj);
    }
	confirmStopTime();
	if(parseInt(confirmTime) > effectComTime){//2���Ӳ���Ӧ�����жϳ�ʱ
		isPassTime = true;
		clw().removediv();
		var contents = '<div style="color:#ff0000; text-align: center; height: 100px; margin-top: 20px; font-size: 14px; line-height: 20px;">����ʱ��<p>ϵͳ����<span id="closeTimeS">10</span>����Զ��ر�</p></div><iframe style="width:100%;height:1px;filter:alpha(opacity=0);-moz-opacity:0"></iframe>';
		clw().showDialog(300,200).setTitle("��ʱ��ʾ",false).setContent(contents);
		closePage('closeTimeS',10,'close');
		//window.close();//�رմ���
		return false;
	}
	
	countCourseTime=setInterval("countCourseTimeFunction()",countTimeDelay);//�ָ���ʱ��
}


//�رղ��Ŵ��ڣ�����¼ѧϰʱ��
function unloadCourseFrame(){
	if(isCloseFlag){
		return
	}
	isCloseFlag = true; 
	sleepTime=0;
	clw().removediv();
	$.ajax({
			type: "post",
			url: StudyURL,
			data: {act:'exit',courseId:courseid,logId:logId},
			async: false,
			cache: false,
			dataType:'json',
			success:function(data, textStatus){
				if(timeOutObj){
					 clearTimeout(timeOutObj);
				}
				var currentTime = (data.playTime == null) ? 0 : data.playTime;
				var totalPlayTime = secToTime(currentTime);
				if(isPassTime){
					//var contents = '<div style="color:#F00; text-align:center;height:100px;margin-top:20px;">����ѧϰ:'+totalPlayTime+'.<p><span onclick="clw().removediv();">ȷ��</span></p><p>ϵͳ����<span id="showTimeS">10</span>����Զ��رմ˶Ի���</p></div><iframe style="width:100%;height:1px;filter:alpha(opacity=0);-moz-opacity:0"></iframe>';
					//clw().showDialog(300,200).setTitle("ѡ����ʾ",false).setContent(contents);
					//closePage('showTimeS',10,'');
				}
				$.ajax({
					type: "post",
					url: StudyURL,
					data: {act:'getSession',courseId:courseid},
					async: false,
					cache: false,
					dataType:'json',
					success:function(data, textStatus){
						clw().removediv();
						if(data.isNotChooseCourse == 1){
							sleepTime=0;
							if(isPassTime){
								//var contents = '<div style="color:#F00; text-align:center;height:100px;margin-top:20px;">����û��ѡ������γ̣��Ƿ�ѡ��?<p><span onclick="if(timeOutObj){clearTimeout(timeOutObj);}clw().removediv();">ѡ��</span>&nbsp;&nbsp;<span onclick="checkSelectCourse();">��ѡ��</span></p><p>������Ӧϵͳ����<span id="selectsTimeS">30</span>����Զ�Ϊ��ѡ�ϴ��ſγ�</p></div><iframe style="width:100%;height:1px;filter:alpha(opacity=0);-moz-opacity:0"></iframe>';
								//clw().showDialog(300,200).setTitle("ѡ����ʾ",false).setContent(contents);
								//closePage('selectsTimeS',30,'');
							}else{
								ret=window.confirm('����û��ѡ������γ̣��Ƿ�ѡ��');
								if(!ret){
									checkSelectCourse();
								}
								
							}
						}
					},
					error:function(data){
						
					}
				});
				
				if(!isPassTime){
					alert("����ѧϰ:"+totalPlayTime+"��");
				}
				
			},
			error:function(data){
				
			}
		});
	
	//return false;

}

function checkSelectCourse(){
	$.ajax({
		type: "post",
		url: StudyURL,
		data: {act:'removeChooseCourse',courseId:courseid},
		async: false,
		cache: false,
		dataType:'json',
		success:function(data, textStatus){
			
		},
		error:function(data){
			
		}
	});
}


//�Ƿ񵯳�ȷ��ѧϰ��
function isPopWin(playTime){
	var needPopWin = false;
	var t = playTime / PopWinTime;
	if(t >=1){
		var dalayT = countTimeDelay / 1000;
		var m =  playTime % PopWinTime;
		if(m >= 0 && m < dalayT){
			needPopWin = true;
		}
	}
	return needPopWin;
}

//�����ǰ���·�����ʱ��
function updateLastStudyTime(){
	$.ajax({
			type: "post",
			url: StudyURL,
			data: {act:'updateLastStudyTime'},
			async: false,
			cache: false,
			dataType:'json',
			success:function(data, textStatus){
				
			},
			error:function(data){
				
			}
		});
	
}

//ȡ�ؼ��ʱ��
function confirmStopTime(){
	$.ajax({
			type: "post",
			url: StudyURL,
			data: {act:'confirmStopTime'},
			async: false,
			cache: false,
			dataType:'json',
			success:function(data, textStatus){
				confirmTime = data.time
			},
			error:function(data){
				
			}
		});
	
}

/*���ſγ�*/
function playCourse(courseid,coursetitle,delay){
	window.open("/study/container.htm?courseid="+courseid+"&coursetitle="+coursetitle+"&delay="+delay,"k","location=0,resizable=1");
}


//����ר��ʱ��
function secToTime(sec){
	var hour;
	var min;
	var sec;

	var leftSec;

	if(isNaN(sec) == true){
		alert("��ѡ��һ������");
		return null;
	}

	hour = Math.floor(sec / 3600);
	hour = "00"+hour;
	hour = hour.substring(hour.length -2,hour.length);

	leftSec = sec % 3600;

	min = Math.floor(leftSec / 60);
	min = "00"+min;
	min = min.substring(min.length -2,min.length);

	sec = leftSec % 60;
	sec = "00"+sec;
	sec = sec.substring(sec.length -2,sec.length);

	return hour + ":" + min + ":" + sec;
}


// ����ѧϰ���cookie ѧ����Чʱ��ʱ ��ʾ�Ƿ����ѧϰ ��1��=������ѧϰ���´β�������ʾ�򣬡�2��=���� һֱ����ѯ�ʿ�
function set_study_cookie(name,value,expire)
{
	var exp  = new Date();    
    exp.setTime(exp.getTime() + expire*3600*1000);    
    document.cookie     = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
   // document.cookie     = name + "="+ escape (value); 
}
//ȡcookie ֵ  
function get_study_cookie(name) {    
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));    
    if(arr != null) return unescape(arr[2]); return null;    
}    

//ɾ��cookie
function del_study_cookie(name,value){    
    var exp = new Date();    
    exp.setTime(exp.getTime() - 1000);  
    document.cookie     = name + "="+ escape (value) + ";expires=" + exp.toGMTString();    
    //var cval=getCookie(name);    
    //if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();    
} 