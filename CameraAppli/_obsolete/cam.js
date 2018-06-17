window.onload = function() {
    'use strict';

    // getUserMedia��Ή��`�F�b�N
    if (navigator.mediaDevices.getUserMedia === undefined || navigator.mediaDevices.enumerateDevices === undefined) {
        console.error('getUserMedia is not supported by the browser.');
        return;
    }

    // �ڑ�����Ă���J�����ƃ}�C�N��MediaStream�I�u�W�F�N�g���擾����
    navigator.mediaDevices.enumerateDevices().then(function(sourcesInfo) {
      // �擾�ł����J�����ƃ}�C�N���܂ރf�o�C�X����J�����������t�B���^�[����
      var videoSroucesArray = sourcesInfo.filter(function(elem) {
          return elem.kind == 'videoinput';
      });
      render(videoSroucesArray);
    });

    /**
     * �J������I������Z���N�g�{�b�N�X��g�ݗ��Ă�
     */
    function render(videoSroucesArray) {
        var $selectBox = document.querySelector('#select')
        videoSroucesArray.forEach(function(source, idx) {
            var label = source.label !== "" ? source.label : ("�J����" + idx);
            $selectBox.insertAdjacentHTML("beforeend", "<option value='" + source.deviceId + "'>" + label + "</option>");
        });
        return this;
    }

    var currentStream;
    /**
     * �J�����̍Đ����J�n����
     */
    function start(e) {
        // ���ɃJ�����Ɛڑ����Ă������~
        if (currentStream) {
            currentStream.getVideoTracks().forEach(function(devise) {
                devise.stop();
            });
            currentStream = null;
        }

        if (e.target.value === "") {
            return;
        }

        var constraints = {
            video: {
                optional: [{
                    sourceId: e.target.value
                }]
            }
        };
        // Video �� Audio�̃L���v�`�����J�n
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            currentStream = stream; // �J������؂�ւ������ɒ�~���邽�ߊi�[
            var $video = document.querySelector('#video');
            $video.src = window.URL.createObjectURL(stream);
            $video.play(); // firefox�p
        }, function() {
            console.log("error:" + arguments);
        })
    }

	function decodeImageFromBase64(data, callback){
    	qrcode.callback = callback;
    	qrcode.decode(data)
	}

    var selectBox = document.querySelector('#select');
    selectBox.addEventListener('change', start, false);

    function download() {
        var cEle = document.createElement('canvas');
        var cCtx = cEle.getContext('2d');
        var vEle = document.querySelector('#video');

        cEle.width = vEle.videoWidth; // canvas�̕��ƍ������A����̕��ƍ����ɍ��킹��
        cEle.height = vEle.videoHeight;

        cCtx.drawImage(vEle, 0, 0); // canvas�Ɋ֐����s���̓���̃t���[����`��

	    decodeImageFromBase64(cEle.toDataURL('image/png'), function(result) {
	    	alert(result);
		});

        var aTag = document.createElement('a');
        aTag.setAttribute('href', cEle.toDataURL());
        aTag.setAttribute('download', "video.png");
        aTag.click(); // Firefox�ł͓����Ȃ�
    }

    var video = document.querySelector('#video');
    video.addEventListener('click', download, false);
};