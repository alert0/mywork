export const realLength = (str) => {
	let j = 0;
	for(var i = 0; i <= str.length - 1; i++) {
		j = j + 1;
		if((str.charCodeAt(i)) > 127) {
			j = j + 2;
		}
	}
	return j;
}

window.realLength = realLength;

export const checkLength =(str,strLen,elMaxLen) =>{
	if(strLen <= elMaxLen) {
		return str;
	}
	
	let j = 0;
	for(var i = 0; i <= str.length - 1; i++) {
		j = j + 1;
		if((str.charCodeAt(i)) > 127) {
			j = j + 2;
		}
		
		if(j > elMaxLen){
			return str.substring(0,i);
		}
		
		if(j == elMaxLen) {
			return str.substring(0,i+1);
		}
	}
	return str;
}

window.checkLength = checkLength;