<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="../include/top.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>장면리뷰</title>
<link rel="stylesheet" href="/css/bootstrap.css">
<link rel="stylesheet" href="/css/fontawesome.css">
<link rel="stylesheet" href="/css/all.css">
<link rel="stylesheet" href="/css/movieReview.css">
<link rel="stylesheet" href="/css/common.css">
<style>
.span-more {
    color: #00cc99;
    cursor: pointer;
}
#comment-area {
    padding: 0.5em;
}

#map {
    height: 30em;
}
#map-container {
    display: none;
}
</style>
</head>
<body>

<jsp:include page="../include/header.jsp"></jsp:include>
<main role="main" class="container borderGray">

    <div class="row">
        <div class="col-12" id="movie-cover" style="background-image: url(${sceneReview.imgPath})">
            <div class="row col-12" id="movie-content">
                <div id="movie-title" class="float-left">
                    <h3><b>${tmdbMovie.title}</b>
                        <c:if test="${not empty sessionScope.loginUser}">
                        <a href="#" data-toggle="modal" data-target="#srAddModal" class="btn-pencil" ><img src="/img/btn-pencil.png"></a>
                        </c:if>
                    </h3>
                    <p>(${tmdbMovie.releaseDate})</p>
                </div>
                
                <div id="movie-genres" class="float-right">
                    <c:forEach items="${tmdbMovie.genres}" var="genre">
                        <div class="genre-tag">${genre.name}</div>
                    </c:forEach>
                </div>
            </div>
            
            <div class="row">
                <div id="scene-list-container">
                    <c:forEach items="${sceneList}" var="scene">
                        <div class="scene-box">
                            <img class="scene-img" src="${scene.imgPath}"
                                data-toggle="tooltip" data-placement="top" title="${scene.title} (${scene.time})">
                        </div>
                    </c:forEach>
                </div>
            </div>
            
            
        </div>
    </div>
    
    <c:if test="${sceneReview.time eq null}">
        <div class="row mt-3 ml-1">
            <div class="col-9 col-md-12">
                <div class="alert alert-secondary" role="alert">
                    <span>등록된 리뷰가 없습니다. <br>이 영화의 첫 리뷰어가 되어주세요!</span>
                </div>
            </div>
        </div>
    </c:if>
    
    <c:if test="${sceneReview.time ne null}">
    <div class="row mt-3 ml-1">
        <div class="col-lg-9 col-md-12">
            <c:if  test="${sceneReview.trgtSrExist == true}">
                <h3>${sceneReview.title}<span id="span-sr-time"> (${sceneReview.time})</span></h3>
                <c:choose>
                    <c:when test="${fn:length(sceneReview.cont) > 150}">
                        <p id="p-cont">${fn:substring(sceneReview.cont, 0, 150)}.. 
                            <span class="span-more" onclick="contMore()">더보기</span></p>
                    </c:when>
                    <c:otherwise>
                        <p>${sceneReview.cont}</p>
                    </c:otherwise>
                </c:choose>
                
                <c:if test="${not empty sessionScope.loginUser}">
                    <form id="addCommentForm" action="addComment" method="post">
                    <input type="hidden" name="srno" value="${sceneReview.srno}">
                    <input type="hidden" name="lat">
                    <input type="hidden" name="lng">
                    <input type="hidden" name="mapName">
                    <div class="card" id="comment-area">
                        <div class="media">
                          <div>
                              <img class="mr-2 profile-medium" src="${loginUser.profileImagePath}" alt="Generic placeholder image">
                              <div>${loginUser.nickname}</div>
                          </div>
                          <div class="media-body">
                            <textarea class="form-control" name="cont" rows="3" placeholder="Write a comment"></textarea>
                            <button type="button" id="btn-map" class="btn btn-light mt-2"><i class="fas fa-map-marker-alt"></i> 장소</button>
                            
                            <label class="btn btn-light mt-2 mb-0" for="my-file-selector">
                                <input id="my-file-selector" type="file" name="file1" style="display:none" 
                                onchange="$('#upload-file-info').html(this.files[0].name)">
                                <i class="fas fa-file-image"></i> 사진
                            </label>
                            <span class='label label-info' id="upload-file-info"></span>
                            
                            <button type="button" class="btn btn-dark mt-2 float-right" onclick="addComment()">
                                <i class="fas fa-paper-plane"></i> 등록</button>
                            
                            <!-- <div id="map" class="mt-2" style="display:none;"></div> -->
                          </div>
                          
                        </div>
                    </div>
                    
                    
                    </form>
                    
                    <div class="card mt-2" id="map-container">
                      <div class="card-body p-0">
                        <div style="display:none">
                            <div id="search_box" class="pl-2 form-inline">
                                <input type="text" class="form-control mr-sm-2" id="search_keyword" placeholder="검색">
                                <!-- <button type="button" class="btn btn-dark" id="search-btn">검색</button> -->
                            </div>
                        </div>
                        <div id="map"></div>
                      </div>
                    </div>
                </c:if>
                
                
            </c:if>
            <c:if  test="${sceneReview.trgtSrExist == false}">
                <div class="alert alert-secondary" role="alert">
                  <span>해당 시간의 장면리뷰가 없습니다.</span>
                </div>
            </c:if>
        </div>
        <div class="col-lg-3 col-md-12">
            
            
            
        </div>
    </div>
    </c:if>
    
<%-- <button type="button" class="btn btn-primary" data-toggle="modal"
        data-target="#reportModal">신고하기</button>
<jsp:include page="../report/report.jsp"></jsp:include> --%>

<%@ include file="addPopup.jsp" %>
</main>

    <jsp:include page="../include/footer.jsp"></jsp:include>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA9sQq54221Pu41MGJFSeAYiHPoYebDTd8&libraries=places"></script>
    <script>
    
    $('[data-toggle="tooltip"]').tooltip();
    
    /* ===== 하단 장면 목록 박스 관련  ===== */
    var initScene = { imgPath: '${sceneReview.imgPath}'};
    $('.scene-img').on('mouseover', function() {
        var imgPath = $(this).attr('src');
        $('#movie-cover').css('background-image', 'url(' + imgPath + ')');
    }).on('mouseleave', function() {
        $('#movie-cover').css('background-image', 'url(' + initScene.imgPath + ')');
    });
    
     /* ===== 입력 모달 관련  ===== */
    var $modal = $('#srAddModal').modal({show : false});
    
    $('#srTimeSlider').on('input', function() {
        var sec_num = parseInt(this.value, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        $('#time').val(hours+':'+minutes+':'+seconds);
    });
    
    function addSceneReview() {
        if (validateForm() == false)
            return;
        $('input[name="spo"]').val($('#tfSpo').prop('checked')? 'Y': 'N');
        $('form#srAddForm').submit();
    }
    
    function validateForm() {
        // 장면 시간 검사
        var timeVal = $('#srAddForm #time').val();
        var pattern = /[0-9]{2}:[0-9]{2}:[0-9]{2}/gi;
        if (!(pattern.test(timeVal))) {
            alert('장면 시간 형식에 맞게 입력해 주세요(시:분:초)');
            return false;
        }
        // 장면제목
        var titleVal = $('#srAddForm input[name="title"]').val();
        if (titleVal == '') {
            alert('장면제목을 입력해 주세요');
            return false;
        }
        // 장면내용
        var contVal = $('#srAddForm textarea[name="cont"]').val();
        if (contVal == '') {
            alert('장면내용을 입력해 주세요');
            return false;
        }
        // 파일 선택
        if ($('#srAddForm input[name="phot"]').val().length == 0) {
            alert('이미지를 선택해 주세요');
            return false;
        }
        return true;
    }
    
    /* ===== 댓글 입력 관련  ===== */
    function contMore() {
        $('#p-cont').text('${sceneReview.cont}');
    }
    
    function addComment() {
        var contVal = $('#addCommentForm textarea[name="cont"]').val();
        if (contVal == '') {
            alert('내용을 입력해주세요.');
            return;
        }
        
        if (marker != null) {
            console.log(marker);
            $('#addCommentForm input[name="lat"]').val(marker.position.lat());
            $('#addCommentForm input[name="lng"]').val(marker.position.lng());
            $('#addCommentForm input[name="mapName"]').val(marker.address);
        }
        
        $('#addCommentForm').submit();
    }
    
    /* ===== 지도 관련  ===== */
    $('#btn-map').click(function() {
        $('div#map-container').toggle(function() {
            if ($(this).css('display') == 'none') { //지도 숨김 시 marker remove
                if (marker != null) {
                    marker.setMap(null);
                    marker = null;
                }
            }
        });
    });
    
    var map;
    var marker;
    var autocomplete;
    function initialize() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.4971473, lng: 127.0222202},
        zoom: 14
      });
      
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('search_box'));
      
      //마커
      var geocoder = new google.maps.Geocoder();
      var address;
      google.maps.event.addListener(map, 'click', function(event) {
          geocoder.geocode({
              'latLng': event.latLng
          }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  address = results[0].formatted_address;
                  addMarker(event.latLng, map, address);
              } else {
                  addMarker(event.latLng, map, null);
              }
          });
      });
      
      //자동완성
      var input = document.getElementById('search_keyword');
      autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', onPlaceChanged);
    }
    
    function onPlaceChanged() {
        var place = autocomplete.getPlace();
        console.log(place);
    }
    
    function addMarker(location, map, address) {
      if (marker != null) marker.setMap(null);
      
      marker = new google.maps.Marker({
          position: location,
          map: map
      });
      
      if (address != null) marker.address = address;
    }
    
    <c:if test="${not empty loginUser}">
        google.maps.event.addDomListener(window, 'load', initialize);
    </c:if>
    </script>
</body>
</html>