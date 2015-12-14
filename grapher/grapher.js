// helpers ------------------------------------------------------------------
// fix for JSON.stringify arrays
if(window.Prototype) {delete Array.prototype.toJSON;}
// parse cookie names
function getCookie(key) {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}

// main ---------------------------------------------------------------------
jQuery(function() {
  var options = {
    url: '/api_jsonrpc.php',
    timeout: 5000,
    ssid: getCookie('zbx_sessionid'),
    pagelen: 24
  },
  $=jQuery;
  console.log('starting');

  //timeline init
  window.flickerfreeScreenShadow.timeout = 30000 ;
  window.flickerfreeScreenShadow.responsiveness = 10000;
  var d=new Date();
  d.setFullYear(d.getFullYear() - 1);
  timeControl.addObject("scrollbar", {
    "period": 10800,
    "starttime": cdumpts(d),
    "isNow": 1
  },
  {
    "id":'scrollbar',
    "loadScroll":1,
    "mainObject":1,
    "periodFixed":'1',
    "sliderMaximumTimePeriod":63072000
  });
  timeControl.processObjects();
  cookie.init();

  //ZabbixApi wrapper
  function ZabbixApi(method, params, success) {
    $.ajax({
      contentType: 'application/json-rpc',
      type: 'POST',
      timeout: options.timeout,
      url: options.url,
      data: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        id: 0,
        auth: options.ssid,
        params: params,
      }),
      success: function(response, status) {
        success(response, status);
      }
    });
  }

  //Hosts list
  $("#hosts").chosen({search_contains: true}).change(function(e){
    console.log('hosts changed');
    updateHint(this);
    updateGraphs();
    updateItems();
  });
  //fill in hosts list on start
  ZabbixApi('hostgroup.get', {
      monitored_hosts: 1,
      sortfield: 'name',
      selectHosts: ['name'],
      output: ['name']
    },
    function(r){
      $.each(r.result, function(){
        var og = $('<optgroup label="'+this.name+'" data-groupid="'+this.groupid+'"/>');
        $.each(this.hosts, function(){
            $('<option value="'+this.hostid+'" />').html(this.name).appendTo(og);
        });
        og.appendTo( $('#hosts') );
      });
      $('#hosts').trigger("chosen:updated");
    }
  );

  //Graphs list
  $("#graphs").chosen({search_contains: true}).change(function(e){
    console.log('graphs changed');
    updateHint(this);
    drawGraphs();
  });
  //Update graphs lists
  function updateGraphs(){
    $('#graphs').empty();
    if($('#hosts').val() != null){
      ZabbixApi('graph.get', {
          hostids: $('#hosts').val(),
          expandName: 1,
          output: ['name','graphtype'],
          sortfield: 'name',
        },
        function(r){
          graphs={}
          $.each(r.result, function(){
            if(graphs[this.name]==undefined) graphs[this.name]=[this.graphid];
            else graphs[this.name].push(this.graphid);
          });
          $('#graphs').empty(); //race on shift-click
          var selected=($('#hosts').val().length==1)? 'selected' : '';
          $.each(graphs, function(k,v){
            $('<option value="'+v+'" '+selected+'/>').html(k).appendTo($('#graphs'));
          });
          $('#graphs').trigger("chosen:updated");
          $('#graphs').trigger('change');
        }
      );
    }
    else {
      $('#graphs').trigger("chosen:updated");
      $('#graphs').trigger('change');
    }
  }
  //Select All Graphs
  $('#graphs-all').click(function(){
    $('#graphs option').prop('selected', true);
    $('#graphs').trigger("chosen:updated");
    $('#graphs').trigger('change');
  });
  //Draw selected graphs (page)
  function drawGraphs(page){
    //cleanup
    $('#pics').empty();
    timeControl.objectList={};
    $.each(flickerfreeScreen.screens, function(){
      clearTimeout(this.timeoutHandler);
    });
    flickerfreeScreen.screens=[];

    graphs=[]
    if($('#graphs').val()!=null) $.each( $('#graphs').val(), function(){
      graphs=graphs.concat(this.split(','));
    });
    if(graphs.length > options.pagelen){
      if(page==undefined) page=0;
      pages=Math.floor(graphs.length/options.pagelen);
      start = page * options.pagelen;
      end = Math.min(start + options.pagelen, graphs.length);
      var s='';
      for(var i=0; i<=pages; i++){
        s+=(i==page)? ' | <span class="link bold" data-num="'+i+'">'+(i+1)+'</span>' : ' | <span class="link" data-num="'+i+'">'+(i+1)+'</span>';
      }
      if(page>0) s='<span class="link" data-num="'+(page-1)+'">&lt; Previous</span>'+s;
      else s=s.substr(3);
      if(page!=pages) s+=' | <span class="link" data-num="'+(page+1)+'">Next &gt;</span>';
      pager=$('<div class="paging"/>').append(s);
      pager.appendTo( $('#pics') );
    }
    else {
      start=0;
      end=graphs.length;
    }
    for (var i=start; i<end; i++) {
      id=graphs[i];
      $('#pics').append(
        $('<div class="flickerfreescreen" id="flickerfreescreen_'+id+'" />')
          .append('<a href="charts.php?graphid='+id+'" id="graph_container_'+id+'" />')
      );
      timeControl.addObject(id,
      {
       "period": timeControl.timeline._period,
       "starttime": cdumpts(timeControl.timeline._starttime),
       "usertime": cdumpts(timeControl.timeline.usertime),
       "isNow": timeControl.timeline._isNow
      },
      {
        "containerid":"graph_container_"+id,
        "objDims":{
          "shiftYtop":35,
          "yaxis":"0",
          "graphtype":"0",
          "graphHeight":"200",
          "shiftXleft": 50,
          "shiftXright": 50,
          "width":"600"
        },
        "loadSBox":1,
        "loadImage":1,
        "periodFixed":"1",
        "sliderMaximumTimePeriod": timeControl.timeline.maxperiod,
        "src": "chart2.php?graphid="+id+"&width=600&height=200&period="+timeControl.timeline._period+""
      });
      window.flickerfreeScreen.add({
        "id": id,
        "isFlickerfree":true,
        "pageFile":'screens.php',
        "resourcetype":'0',
        "mode":0,
      //  "timestamp":1450022637,
        "interval":'60',
        // "screenitemid":'336',
        // "screenid":'34',
        // "groupid":null,
        // "hostid":0,
        "timeline":{
          "period": timeControl.timeline._period,
          // "stime":'20151213070357',
          // "stimeNow":'20161212070357',
          // "starttime":'20131213080357',
          // "usertime":'20151213080357',
          "isNow": timeControl.timeline._isNow
        },
      //  "profileIdx":'web.screens',
      //  "profileIdx2":'34',
      //  "updateProfile":true,
        "data":null
      });
      timeControl.useTimeRefresh(60);
      timeControl.processObjects();
      chkbxRange.init()
    };
    if(graphs.length > options.pagelen) {
      pager.clone().appendTo( $('#pics') );
      $('div.paging span.link').click(function(){
        drawGraphs( $(this).data('num') );
      });
    }
  }


  //Items list
  $("#items").chosen({search_contains: true}).change(function(e){
    console.log('items changed');
    updateHint(this);
  });
  //Update items lists
  function updateItems(){
    $('#items').empty();
    if($('#hosts').val() != null){
      ZabbixApi('item.get', {
          hostids: $('#hosts').val(),
          selectApplications: ['name'],
          filter: {
            state: 0, //supported
            status: 0, //enabled
            value_type: [0,3] //numeric
          },
          output: ['name','description','error','key_','units'],
          sortfield: 'name',
        },
        function(r){
          apps={}
          $.each(r.result, function(){
            var app=(this.applications.length)? this.applications[0].name : '-';
            //todo: expand $1 from .key_
            if(apps[app]==undefined) apps[app]={}
            if(apps[app][this.name]==undefined) apps[app][this.name]=[this.itemid];
            else apps[app][this.name].push(this.itemid);
          });
          $.each(apps, function(app,items){
            var og = $('<optgroup label="'+app+'" />');
            $.each(items, function(i,v){
                $('<option value="'+v+'" />').html(i).appendTo(og);
            });
            og.appendTo( $('#items') );
          });
          $('#items').trigger("chosen:updated");
          $('#items').trigger('change');
        }
      );
    }
    else {
      $('#items').trigger("chosen:updated");
      $('#items').trigger('change');
    }
  }

  //Number hint and clear button
  ['hosts','graphs','items'].each(function(i){
    $('#'+i+'_chosen li.search-field').append('<div class="chsn-clean" title="clean"/><div class="chsn-hint"/>');
  });
  $('li.search-field').click(function(){
    $(this).find('input').focus();
  });
  $('.chsn-clean').click(function(){
    var s=$(this).closest('.chosen-container').prev('select');
    s.find('option:selected').removeAttr('selected');
    s.trigger('chosen:updated');
    s.trigger('change');
  });
  function updateHint(o){
    if($(o).val() == null){
      $(o).next().find('.chsn-hint').html('');
      $(o).next().find('.chsn-clean').html('');
    }
    else {
      $(o).next().find('.chsn-hint').html( $(o).val().length + ' selected' );
      $(o).next().find('.chsn-clean').html('&times;');
    }
  }


});