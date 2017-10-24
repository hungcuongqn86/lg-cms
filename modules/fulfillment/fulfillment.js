function Fulfillment() {
    this.backendurl = '';
    this.state = 'processing';
    this.vfomatdate = 'd/M/yyyy';
    this.date_start = '';
    this.date_end = '';
    this.custom = [];
    this.data = [];
}

Fulfillment.prototype.init = function (module) {
    var myjs = this;
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    this.backendurl = absolutePath + 'modules/inc/fulfillment.php';
    $('.select-box').selectctr();
    var datecurr = $('#curr-server-date').val();
    this.date_start = Date.parse(datecurr).add(-6).days().toString(this.vfomatdate);
    this.date_end = Date.parse(datecurr).toString(this.vfomatdate);

    $('#option-date').unbind('change').change(function () {
        if ($(this).val() === 'customize') {
            $('.customize-date').show();
            return;
        } else {
            $('.customize-date').hide();
            var datecurr = $('#curr-server-date').val();
            var numberday = parseInt($(this).val());
            myjs.date_start = Date.parse(datecurr).add(numberday).days().toString(myjs.vfomatdate);
            myjs.date_end = Date.parse(datecurr).toString(myjs.vfomatdate);
        }
        myjs.getData();
    });

    $('.date-ranger-picker').daterangepicker({
            locale: {
                format: 'DD/MM/YYYY'
            }
        },
        function (start, end) {
            myjs.date_start = start.format('DD/MM/YYYY');
            myjs.date_end = end.format('DD/MM/YYYY');
            myjs.getData();
        }
    );

    this.getData();
};

Fulfillment.prototype.startload = function (div) {
    if ($(div).find('.data-loading').length === 0) {
        $(div).addClass('dataload').append('<div class="data-loading"><span style="margin: auto;"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></span></div>');
    }
};

Fulfillment.prototype.endLoad = function (div) {
    $(div).find('.data-loading').remove();
};