<?php
require_once dirname(__FILE__).'/include/config.inc.php';
require_once dirname(__FILE__).'/include/hosts.inc.php';
require_once dirname(__FILE__).'/include/graphs.inc.php';

$page['title'] = _('Grapher');
$page['hist_arg'] = array('hostid', 'groupid', 'graphid');
$page['scripts'] = array('class.calendar.js', 'gtlc.js', 'flickerfreescreen.js');
$page['type'] = detect_page_type(PAGE_TYPE_HTML);

define('ZBX_PAGE_DO_JS_REFRESH', 1);

ob_start();

require_once dirname(__FILE__).'/include/page_header.php';

// VAR  TYPE  OPTIONAL  FLAGS VALIDATION  EXCEPTION
$fields = array(
  'groupid' =>  array(T_ZBX_INT, O_OPT, P_SYS, DB_ID,   null),
  'hostid' =>   array(T_ZBX_INT, O_OPT, P_SYS, DB_ID,   null),
  'graphid' =>  array(T_ZBX_INT, O_OPT, P_SYS, DB_ID,   null),
  'period' =>   array(T_ZBX_INT, O_OPT, P_SYS, null,    null),
  'stime' =>    array(T_ZBX_STR, O_OPT, P_SYS, null,    null),
  'fullscreen' => array(T_ZBX_INT, O_OPT, P_SYS, IN('0,1'), null),
  // ajax
  'filterState' => array(T_ZBX_INT, O_OPT, P_ACT, null,   null),
  'favobj' =>   array(T_ZBX_STR, O_OPT, P_ACT, null,    null),
  'favid' =>    array(T_ZBX_INT, O_OPT, P_ACT, null,    null),
  'favaction' =>  array(T_ZBX_STR, O_OPT, P_ACT, IN('"add","remove"'), null)
);
check_fields($fields);


/*
 * Ajax
 */
if ($page['type'] == PAGE_TYPE_JSON){
  die("{'status': 'ok'}");
}

ob_end_flush();

?>
<table width="100%" cellpadding="0" cellspacing="0">
  <tr class="textcolorstyles pointer">
    <td>
      <table class="textwhite maxwidth middle flicker" cellspacing="0" cellpadding="1" id="filter_icon" onclick="javascript: changeFlickerState('flicker_hat_charts', &quot;Hide filter&quot;, &quot;Show filter&quot;);">
        <tr><td class="flicker_c" align="center" colspan="1">
          <table class="textwhite"><tr>
            <td><div class="dbl_arrow_up" id="flicker_icon_l" title="Maximize/Minimize">&nbsp;&nbsp;</div></td>
            <td><span id="flicker_title">&nbsp;Hide filter&nbsp;</span></td>
            <td><div class="dbl_arrow_up" id="flicker_icon_r" title="Maximize/Minimize">&nbsp;&nbsp;</div></td>
          </tr></table>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td><div id="flicker_hat_charts"><div id="scrollbar_cntr"></div></div></td>
  </tr>
</table>

<script src="grapher/chosen.jquery.js" type="text/javascript"></script>
<script src="grapher/grapher.js" type="text/javascript"></script>
<link rel="stylesheet" href="grapher/chosen.css">
<link rel="stylesheet" href="grapher/grapher.css">

<table class="filter" cellspacing="0" cellpadding="0"><tbody>
  <tr>
    <td class="label"><strong>Host:</strong></td>
    <td class="inputcol"><select data-placeholder="Select Host(s)..." style="width:350px;" multiple id="hosts"></select></td>
    <td class="label"><strong>Graph:</strong></td>
    <td class="inputcol">
      <select data-placeholder="Select Graph(s)..." style="width:350px;" multiple id="graphs"></select>
      <span class="subfilter_disabled" id="graphs-all">Select All</span>
    </td>
    <td class="label"><strong>Item:</strong></td>
    <td class="inputcol"><select data-placeholder="Select Item(s)..." style="width:350px;" multiple id="items"></select></td>
  </tr>
</tbody></table>
<br>

<div id="pics"></div>

<?
require_once dirname(__FILE__).'/include/page_footer.php';
