$(function() {



    /* ========== 이미지 업로드 관련  ========== */
    var uploadFileNames = [];

    $('body').on('change', '.picupload', function(event) {
        var files = event.target.files;

        if(uploadFileNames.length+files.length>3){
            alert("3장 이하의 사진만 업로드 할 수 있습니다.");
        }else{
            fileUploadAjax(files);
        }
    });

    $('body').on('click', '.remove-pic', function() {
        var removeItem = $(this).attr('data-name');
        fileRemoveAjax(removeItem);
    });

    function removeUploadedImg(removeItem) {
        $('#li-' + removeItem).remove();
        var yet = uploadFileNames.indexOf(removeItem);
        if (yet != -1) {
            uploadFileNames.splice(yet, 1);
        }
    }

    function fileRemoveAjax(fileName) {

        $.ajax({
            url : "/app/reviewFeed/fileUpload-remove",
            type: "post",
            data : { 'fileName' : fileName },
            success : function(result) {
                if (result == true) {
                    removeUploadedImg(fileName);
                }
            },
            error : function(error) {
                alert("파일 삭제에 실패하였습니다.");
                console.log(error);
                console.log(error.status);
            }
        });
    }

    function fileUploadAjax(files) {

        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        $.ajax({
            url : "/app/reviewFeed/fileUpload-upload",
            contentType: false,
            processData: false,
            type: "post",
            data : formData,
            success : function(data) {

                if (data.length == files.length) {
                    var newFileNames = [];
                    data.forEach(function(value) {
                        uploadFileNames.push(value);
                        newFileNames.push(value);
                    });
                    displayUploadedImgs(files, newFileNames);
                }
            },
            error : function(error) {
                alert("파일 업로드에 실패하였습니다.");
                console.log(error);
                console.log(error.status);
            }
        });
    }

    function displayUploadedImgs(files, newFileNames) {
        var $mlist = $("#media-list");
        for (var i = 0; i < files.length; i++) {
            files[i].realName = newFileNames[i];
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.match('image')) {

                var picReader = new FileReader();
                picReader.realName = file.realName;
                picReader.fileName = file.name;
                picReader.addEventListener("load", function(event) {

                    var picFile = event.target;
                    var div = document.createElement("li");
                    div.id = 'li-' + picFile.realName;
                    div.innerHTML = "<img src='" + picFile.result + "' title='" + picFile.name + "'/>" 
                    + "<div  class='post-thumb'><div class='inner-post-thumb'>"
                    + "<a data-name='" + picFile.realName + "' class='c-pointer remove-pic'><i class='fa fa-times' aria-hidden='true'>"
                    + "</i></a><div></div>";
                    $mlist.prepend(div);
                });
            } else {
                //이미지외의자료임
            }
            picReader.readAsDataURL(file);
        }
    }

    /* ========== 일상/영화게시물 구분 관련  ========== */
    var sValue;
    $('.starrr').starrr({
        change: function(e, value){
            $("#star").val(value);
            sValue=value;
        }
    });

    $("#starbtn").click(function () {
        $('#showStar').toggleClass("nostar");
        if($('#showStar').hasClass("nostar")){
            $("#star").val(0);
            sValue=0;
        }
    });

    $('.open').on('click', function(e) {

        if(this.checked) {
            $('#globe').show();
            $("#lock").hide();
        }else{
            $('#lock').show();
            $("#globe").hide();
        }
    });

    /* ========== 친구태그 관련  ========== */
    var fList = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: flwList
    });
    fList.initialize();

    elt = $('.example_objects_as_tags > > input');
    elt.tagsinput({
        itemValue: 'value',
        itemText: 'text',
        typeaheadjs: {
            name: 'fList',
            displayKey: 'text',
            source: fList.ttAdapter()
        }
    });

    // 영화 자동완성
    $( "#movieSearch" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "/app/movieInfo/listByKeyword",
                method: "POST",
                headers : {
                    'Content-Type': 'application/json;'
                },
                data: JSON.stringify({ "keyword": request.term }),
                success: function( data ) {
                    response($.map(data.movieList, function (item) {

                        if (item.poster_path != null) {
                            poster_path = data.imgPrefix + item.poster_path;
                        } else {
                            poster_path = '/img/default-movie-img.png';
                        }
                        return {
                            label: item.title,
                            value: item.id,
                            release_date:item.release_date,
                            poster_path:poster_path
                        }
                    }));
                }
            });
        },
        focus: function(event, ui) {
            $('#movieSearch').val(ui.item.label);
            event.preventDefault();
        },
        select: function( event, ui ) {
            $("#movieSearch").val(ui.item.label);
            $("#movieId").val(ui.item.value);

            return false;
        }
    }).data('ui-autocomplete')._renderItem = function( ul, item ) {
        return $( "<li class='media'>" ).data("item.autocomplete", item)
        .append("<img class = 'poster' src='" + item.poster_path + "' alt='"+item.label+"'>" + 
                '<div class="media-body">'+
                '<h5 class="mt-0"><b>'+ item.label +'</b></h5>'+
                '(' + item.release_date + ')'+
        '</div>')
        .appendTo( ul );
    };

    // 글 작성
    $('#modalSubmit').on('click', function(e) {
        if($("#pstTypeNo").val() == 0){
            if($("#movieId").val().trim() == 0){
                alert("알맞은 영화제목을 작성해주세요.");
                e.preventDefault();
                return;
            }
        }

        if(!document.getElementById("reviewTxtarea").value.replace(/(^\s*)|(\s*$)/gi, "")){
            alert("내용을 작성해주세요.");
            e.preventDefault();
            return;
        }
        if(($("#star").val() == 0) && ($('#showStar').css("display") != "none")){
            alert("별점 0점은 불가능합니다. 버튼을 눌러 비활성화 시켜주세요.");
            e.preventDefault();
            return;
        }

        $("#photList").val(uploadFileNames);
        $("#ftagsForAdd").val($("#flw").val());
    });

    // 창닫을때
    $('#reviewModal').on('hidden.bs.modal', function (e) {       

        $('#movieSearch').val('');
        $('#reviewTxtarea').val('');
        $('#flw').val('');
        
        $('#globe').show();
        $("#lock").hide();
        $(this).find("input[type=checkbox]").prop("checked", "checked");
        
        $("#movieId").val(0);
        if($('#pstTypeNo').val() == 0){
            $("#star").val(sValue);
        }else{
            $("#star").val(0);            
        }

        $("#ftagsForAdd").val(-1);
        var $inputTag = $("#flw").prev().children().last().clone().wrapAll("<div></div>").parent();
        $("#flw").prev().html($inputTag.html());

        uploadFileNames = [];
        $("#media-list").html(
        '<li class="myupload "><span><i class="fa fa-plus" aria-hidden="true"></i></span></li>');
    });
});

//일상/영화게시물 올리기
function postShow(id) {
    if (id == 'btnIlsang') {
        $("#pstTypeNo").val(1);
        $('.onlyMovie').hide();
    } else {
        $("#pstTypeNo").val(0);
        $('.onlyMovie').show();
    }
}


/* ========== 피드 무한스크롤 ========== */
function morePostHtml(data){
    var html = '';

    postList = postList.concat(data.postsResult); 

    for (var i=0;i<data.postsResult.length;i++) {
        if(i == data.postsResult.length-1){
            lstpstno = String(data.postsResult[i].pstno);
        }

        html += '        <div class="wPost reviewPst">';
        html += '            <div class="media row pr-3 pl-3">';
        html += '                <img src="';
        html += data.postsResult[i].member.profileImagePath;
        html += '"                   class="rprofileImg"/>';
        html += '                <div class="media-body">';
        html += '                    <ul class="memberul">';
        html += '                        <li><span onclick="goToFeed(';
        html += data.postsResult[i].member.mno;
        html += ')" class="text-dark c-pointer">';
        html += data.postsResult[i].member.nickname;
        html += '                            </span></li><li>';

        if('null' !=data.postsResult[i].ftags){
            for(var j=0;j<data.postsResult[i].ftags.length;j++){
                html += '<span onclick="goToFeed(';
                html +=  data.postsResult[i].ftags.mno;
                html +=')" class="tagName c-pointer">';
                html += data.postsResult[i].ftags[j].nickname; 
                html += '</span>';
            }
        }

        html += '                    </li></ul>';

        html += '<span class="cmt-date">&nbsp;';
        html +=  new Date(data.postsResult[i].createdDate).toLocaleString();
        html += '</span>'; 
        if(data.postsResult[i].pstTypeNo == 0){
            html += '<p class="dptitle">';
            html += '<b><i>';
            html += data.postsResult[i].title;
            html += '</i></b></p>';
        }

        html += '               </div>';
        html += '           </div>';
        html += '           <div class="clearfix media row m-1">';
        html += '               <div class="media-body">';
        html += '                   <p class="reviewCont" id="reviewCont-';
        html += data.postsResult[i].pstno;
        html += '">';
        html += makeContHtml(data.postsResult[i].content,data.postsResult[i].pstno);
        html += '</p>';
        html += '               </div>';

        if(data.postsResult[i].photos.length > 0){
            html += '<div class="image">';
            html += '   <img onclick="openDetailModal(';
            html += data.postsResult[i].pstno;
            html += ')" src="/upload/post/';
            html += data.postsResult[i].photos[0];
            html += '" data-title="';
            html += data.postsResult[i].title;
            html += '"   class="pstImgtoDetail"/>';
            html += ' <input type="hidden" data-toggle="modal" id="detailPst"data-target="#detailModal" />';
            if(data.postsResult[i].photos.length>1){
                html += '<div class="text"><p>';
                html += data.postsResult[i].photos.length-1;
                html += '장+</p></div>';
            }

            html += '</div>';
        }
        html += '        </div>';

        html += '       <div class="row">';
        html += '           <div class="col-6 text-left">';

        html += '<i class="fas fa-thumbs-up btmIcon c-pointer likeColor';
        if(!data.postsResult[i].likeCheck){
            html += ' dis-none ';
        }
        html += '"id="btn-like-full-';
        html += data.postsResult[i].pstno;
        html += '" onclick="cancelLike(';
        html += data.postsResult[i].pstno;
        html += ',';
        html += data.postsResult[i].pstTypeNo;
        html += ')"></i>';
        html += '<i class="far fa-thumbs-up btmIcon c-pointer likeColor';
        if(data.postsResult[i].likeCheck){
            html += ' dis-none ';
        }
        html += '"id="btn-like-empty-';
        html += data.postsResult[i].pstno;
        html += '" onclick="addLike(';
        html += data.postsResult[i].pstno;
        html += ',';
        html += data.postsResult[i].pstTypeNo;
        html += ')"></i><span id="lCnt-';
        html += data.postsResult[i].pstno;
        html += '">';
        html += data.postsResult[i].likeCnt;
        html += '</span><i class="far fa-comment btmIcon c-pointer" onclick="showMore(this,';
        html += data.postsResult[i].pstno;
        html += ')"></i>';
        html += '<span id="cCnt-';
        html += data.postsResult[i].pstno;
        html += '">';
        html +=  data.postsResult[i].cmtCnt;
        html += '</span></div>';

        html += '   <div class="col-6 text-right">';
        if(data.postsResult[i].pstTypeNo == 0 && data.postsResult[i].star != 0){

            for(var s = 0;s<5;s++){
                if(s<data.postsResult[i].star){

                    html += '<i class="fas fa-star sStar"></i>';    
                }else{

                    html += '<i class="far fa-star sStar"></i>';
                }
            }
        }

        html += '  </div>'; 
        html += '       </div>';

        html += '   </div>';
    }  

    $('#pstShw').append(html); 
}

$(window).scroll(function() {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {

        $.ajax({
            type:'POST',
            url:'/app/reviewFeed/morePost',
            headers : {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ 
                "pstno" : lstpstno
            }),
            success:function(data){
                morePostHtml(data);
            }
        });
    }
})