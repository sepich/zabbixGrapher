# zabbixGrapher
This is one page js application for quick search/view zabbix graphs, dinamically graph any collected item
* First step is to select host, just start typing HostGroup name or Hostname
![Host](https://habrastorage.org/files/f00/e9b/aa9/f00e9baa94654dd7a4b21f3aab706661.png)  
If you choose one Host - all its graphs would start drawing right away (quick host overview supposed).  
If you select multiple Hosts - no graphs would be drawn (manual comparison supposed) and you can draw graphs for all selected Hosts by clicking `Select All`  
![Graphs](https://habrastorage.org/files/8fc/2ce/36d/8fc2ce36d1814b4fa5a1820405b1b58e.png)  
* You can also draw any items from selected hosts on single graph  
Select items in interest and then click to create either `Normal` or `Stacked` graph  
![Items](https://habrastorage.org/files/698/3e6/3cd/6983e63cd4f54d879f79148383f756ef.png)  
* Time Zooming using usual Zabbix timeline and area selection on graphs supported
* You can click group name in list to select/deselect all subitems ("Filesystems" in screenshot above)
* To share selected Graphs just copy and send the URL (it dynamically updated with current state)

P.S.
It is developed and tested at somewhat old zabbix 2.4.3, no info if it works for latest.

##### Installation
Unzip to root of your zabbix-web folder (Note: `master` branch is for Zabbix 3.0, use `zabbix2.4` branch for older versions).  
Then add to `Main Menu` with something like this:
```diff
+++ ./include/menu.inc.php      2015-12-16 00:49:20.939693369 -0800
@@ -62,6 +62,10 @@
                                'sub_pages' => array('chart2.php', 'chart3.php', 'chart6.php', 'chart7.php')
                        ),
+                       array(
+                               'url' => 'grapher.php',
+                               'label' => _('Grapher')
+                       ),
                        array(
                                'url' => 'screens.php',
                                'label' => _('Screens'),
                                'sub_pages' => array('slides.php')

```
After Installation you could realise that your zabbix-fronted is not powerful enough to render so many images on one page at once. If so - check out this caching story: http://blog.sepa.spb.ru/2016/01/speed-up-zabbix-graphs-with-nginx.html

##### Options
You can tweak some options in the beginning of `grapher.js` file
```js
// main ---------------------------------------------------------------------
jQuery(function() {
  var options = {
    url: '/api_jsonrpc.php',            // zabbix API url
    timeout: 5000,                      // to API in msec
    ssid: getCookie('zbx_sessionid'),   // key to API, get from current logged in user
    pagelen: 24,                        // graphs per page
    width: 600,                         // of graph
    height: 200                         // of graph
  },
```
