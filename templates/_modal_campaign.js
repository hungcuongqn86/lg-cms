//get absolute path
var loc = window.location;
var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
var absolutePath = loc.protocol + '//' + loc.host + pathName;
//backend url
var backendurl = absolutePath + 'modules/inc/modal.php';

var tb_camp_design = null;

var campaign_id = null;

//function open dialog
function openModalCampaign(campid,tab_select){
    $('#modal-campaign').modal('show');
    $('#modal-campaign').each(reposition);
    $('.nav-tabs a[href="#'+tab_select+'"]').tab('show');

    campaign_id = campid;
    getModalCampaign();
    getModalCampaignDesign();
}

function getModalCampaign(){
    $('#modal-campaign-loader').show();
    $.ajax({
        url: backendurl,
        type: "GET",
        dataType: 'json',
        data: {cmd: 'getCampaignInfo',
               id: campaign_id},
        success: function (data) {
            if(data && data.result) {
                $("#modal-camp-campaign-name").html(data.result.S_TITLE);
                var state = data.result.S_STATE;
                if(state == 'approved') state = 'Approved';
                if(state == 'launching') state = 'Launching';
                if(state == 'end') state = 'Ended';
                if(state == 'locked') state = 'Locked';
                if(state == 'deleted') state = 'Deleted';
                $("#modal-camp-campaign-status").html(state);

                $("#modal-campaign-id").html(data.result.S_ID);
                $("#modal-campaign-state").html(state);
                var user_name = data.result.USER_EMAIL;
                if(data.result.USER_NAME) user_name = data.result.USER_NAME + '<br>' + user_name;
                $("#modal-campaign-affiliate").html(user_name);
                $("#modal-campaign-startdate").html(data.result.D_START);
                $("#modal-campaign-enddate").html(data.result.D_END);

                //Get design image
                var img1 = '';
                var img2 = '';
                
                if(data.result.S_FRONT_IMG_URL) var front_img_url = data.result.S_FRONT_IMG_URL;
                else if(data.result.S_FRONT_IMG_URL_2) var front_img_url = data.result.S_FRONT_IMG_URL_2;
                
                
                if(data.result.S_BACK_IMG_URL) var back_img_url = data.result.S_BACK_IMG_URL;
                else if(data.result.S_BACK_IMG_URL_2) var back_img_url = data.result.S_BACK_IMG_URL_2;

                if(data.result.N_BACK_VIEW == 0){
                    if(front_img_url) img1 = front_img_url;
                    if(back_img_url) img2 = back_img_url;
                }
                else{
                    if(front_img_url) img1 = back_img_url;
                    if(back_img_url) img2 = front_img_url;
                }
                if($.trim(img1)){
                    $('#modal-campaign-img-1').attr('src',img1);
                    $('#modal-campaign-img-1').show();
                }
                else{
                    $('#modal-campaign-img-1').hide();
                }
                if($.trim(img2)){
                    $('#modal-campaign-img-2').attr('src',img2);
                    $('#modal-campaign-img-2').show();
                }
                else{
                    $('#modal-campaign-img-2').hide();
                }
            }
            $('#modal-campaign-loader').hide();
        },
        error: function () {
            openModalError();
        }
    });
}

function getModalCampaignDesign(){
    $('#tb-campaign-design-loader').show();
    if(!tb_camp_design){
        tb_camp_design = $("#tb-campaign-design").DataTable({
            'paging':   true,
            'ordering': false,
            'searching': false
        });
    }
    $.ajax({
        url: backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getCampaignProduct',
            id: campaign_id
        },
        success: function (data) {
            $('#tb-campaign-design-loader').hide();
            tb_camp_design.clear().draw();
            if(data && data.result) {                         
                $.each(data.result, function(i,row){
                    //Get base name and color
                    var name = row.BASE_NAME;
                    var color_list = '';
                    if(row.VARIANT){
                        color_list = '<div class="color-list">';
                        $.each(row.VARIANT, function(k,variant){
                            color_list += '<div class="color" style="background-color:'+variant.S_COLOR_VALUE+'"></div>';
                        });
                        color_list += '</div>';
                    }
                    if(color_list != '') name = '<p>'+name+'</p>' + color_list;
                    //Get design image
                    var img1 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                    var img2 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                    
                    if(row.S_FRONT_IMG_URL) var front_img_url = row.S_FRONT_IMG_URL;
                    else if(row.S_FRONT_IMG_URL_2) var front_img_url = row.S_FRONT_IMG_URL_2;
                    
                    
                    if(row.S_BACK_IMG_URL) var back_img_url = row.S_BACK_IMG_URL;
                    else if(row.S_BACK_IMG_URL_2) var back_img_url = row.S_BACK_IMG_URL_2;

                    if(row.N_BACK_VIEW == 0){
                        if(front_img_url) img1 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                        if(back_img_url) img2 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                    }
                    else{
                        if(front_img_url) img1 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                        if(back_img_url) img2 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                    }

                    var col_design = '<div class="design-img-table"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';

                    tb_camp_design.row.add([
                        name,
                        col_design,
                        '$'+row.S_BASE_COST,
                        '$'+row.S_SALE_PRICE,
                        row.N_SALE_EXPECTED]).draw( false );            
                });
            }
        },
        error: function () {
            openModalError();
        }
    });
}

(function ($, AdminLTE) {
    $(document).ready(function(){
        $('#btn-campaign-design-apply').on('click', function (e) {
            $('.dropdown-setting').removeClass('open');
            $.each($(".chk-col-campaign-design"), function(i,item){
                if($(this).is(':checked')){
                    tb_camp_design.column($(this).attr('colnumb')).visible(true);
                }
                else{
                    tb_camp_design.column($(this).attr('colnumb')).visible(false);
                }
            });
        });
    });
})(jQuery, $.AdminLTE);