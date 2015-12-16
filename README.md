# zabbixGrapher
This is one page js application to quick search/view zabbix graphs, dinamically graph any items  
* First step is to select host, just start typing HostGroup name or Hostname  
![Host](https://habrastorage.org/files/f00/e9b/aa9/f00e9baa94654dd7a4b21f3aab706661.png)   
If you choose one Host - all its graphs would start drawing right away (quick host overview suggested).   
If you select multiple Hosts - no graphs would be drawn (manual comparison suggested) and you can draw graphs for all selected Hosts by clicking `Select All`  
![Graphs](https://habrastorage.org/files/8fc/2ce/36d/8fc2ce36d1814b4fa5a1820405b1b58e.png)
* You can also draw any items from selected hosts on single graph  
Select items in interest and then click to create either `Normal` or `Stacked` graph  
![Items](https://habrastorage.org/files/698/3e6/3cd/6983e63cd4f54d879f79148383f756ef.png)  
  
P.S.  
It is developed and tested at somewhat old zabbix 2.4.3, no info if it works for latest.

##### Installation
Unzip to root of your zabbix-web folder.
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