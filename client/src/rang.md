function rang($rankp, $return_een_nummer = 0) {

$rankp = ($rankp > 24000) ? 24000 : \$rankp;

/\*

Nietsnut
Vandaal
Jatter
Dief
Autodief
Crimineel

Hitman
Dangerous-Hitman

Gangster
Dangerous-Gangster

Godfather
Dangerous-Godfather
Unlimited-Godfather

Don
Dangerous-Don
Unlimited-Don

\*/

if ($rankp < 50) {
    $r = 0;
$rankv = 50;
    $hoog = 0;
$rang = "Nietsnut";
    $rangnr = 1;
} elseif ($rankp >= 50 && $rankp < 120) {
$r = 50;
    $rankv = 70;
$hoog = 0;
    $rang = "Vandaal";
$rangnr = 2;
} elseif ($rankp >= 120 && $rankp < 200) {
    $r = 120;
$rankv = 80;
    $hoog = 0;
$rang = "Jatter";
    $rangnr = 3;
} elseif ($rankp >= 200 && $rankp < 320) {
$r = 200;
    $rankv = 120;
$hoog = 0;
    $rang = "Dief";
$rangnr = 4;
} elseif ($rankp >= 320 && $rankp < 480) {
    $r = 320;
$rankv = 160;
    $hoog = 0;
$rang = "Autodief";
    $rangnr = 5;
} elseif ($rankp >= 480 && $rankp < 700) {
$r = 480;
    $rankv = 220;
$hoog = 0;
    $rang = "Crimineel";
$rangnr = 6;
} elseif ($rankp >= 700 && $rankp < 1000) {
    $r = 700;
$rankv = 300;
    $hoog = 0;
$rang = "Hitman";
    $rangnr = 7;
} elseif ($rankp >= 1000 && $rankp < 1300) {
$r = 1000;
    $rankv = 300;
$hoog = 0;
    $rang = "Dangerous Hitman";
$rangnr = 8;
} elseif ($rankp >= 1300 && $rankp < 1800) {
    $r = 1300;
$rankv = 500;
    $hoog = 0;
$rang = "Gangster";
    $rangnr = 9;
} elseif ($rankp >= 1800 && $rankp < 2500) {
$r = 1800;
    $rankv = 700;
$hoog = 0;
    $rang = "Dangerous Gangster";
$rangnr = 10;
} elseif ($rankp >= 2500 && $rankp < 3300) {
    $r = 2500;
$rankv = 800;
    $hoog = 0;
$rang = "Godfather";
    $rangnr = 11;
} elseif ($rankp >= 3300 && $rankp < 4500) {
$r = 3300;
    $rankv = 1200;
$hoog = 0;
    $rang = "Dangerous Godfather";
$rangnr = 12;
} elseif ($rankp >= 4500 && $rankp < 6000) {
    $r = 4500;
$rankv = 1500;
    $hoog = 0;
$rang = "Unlimited Godfather";
    $rangnr = 13;
} elseif ($rankp >= 6000 && $rankp < 8000) {
$r = 6000;
    $rankv = 2000;
$hoog = 0;
    $rang = "Don";
$rangnr = 14;
} elseif ($rankp >= 8000 && $rankp < 12000) {
    $r = 8000;
$rankv = 4000;
    $hoog = 0;
$rang = "Dangerous Don";
    $rangnr = 15;
} else {
$r = 12000;
    $rankv = 12000;
$hoog = 1;
    $rang = "Unlimited Don";
\$rangnr = 16;
}

$a = ($rankp - $r) / $rankv;
$aantaldecimalen = 2;
$aantaldecimalen = ($rangnr <= 14) ? 1 : $aantaldecimalen;
$aantaldecimalen = ($rangnr <= 9) ? 0 : \$aantaldecimalen;

$procenten = round(100 * $a);
$procenten2 = round(100 * $a, \$aantaldecimalen);

if ($return_een_nummer == "1") {
    return $rangnr;
} elseif ($return_een_nummer == "2") {
    return $procenten2;
} else {
return \$rang;
}
}

//end func rang

function rangnummer(\$nummer) {

if ($nummer == 1) {
    $rang = "Nietsnut";
} elseif ($nummer == 2) {
    $rang = "Vandaal";
} elseif ($nummer == 3) {
    $rang = "Jatter";
} elseif ($nummer == 4) {
    $rang = "Dief";
} elseif ($nummer == 5) {
    $rang = "Autodief";
} elseif ($nummer == 6) {
    $rang = "Crimineel";
} elseif ($nummer == 7) {
    $rang = "Hitman";
} elseif ($nummer == 8) {
    $rang = "Dangerous Hitman";
} elseif ($nummer == 9) {
    $rang = "Gangster";
} elseif ($nummer == 10) {
    $rang = "Dangerous Gangster";
} elseif ($nummer == 11) {
    $rang = "Godfather";
} elseif ($nummer == 12) {
    $rang = "Dangerous Godfather";
} elseif ($nummer == 13) {
    $rang = "Unlimited Godfather";
} elseif ($nummer == 14) {
    $rang = "Don";
} elseif ($nummer == 15) {
    $rang = "Dangerous Don";
} elseif ($nummer == 16) {
    $rang = "Unlimited Don";
} else {
\$rang = "fout!";
}

return \$rang;
}

//deze kan weg denk ik????
///dEZE HIER ONDER!!
function rank_percentage(\$rankp) {

if ($rankp == "" OR !is_numeric($rankp)) {
return"Fout bij lezen van ranggetal in de functie.";
}
// $r is altijd waar het begint...
// $rankv is altijd hoeveel rank tussen het begin en ht einde zit...

if ($rankp < 10) {
    $r = 0;
$rankv = 10;
    $hoog = 0;
$rang = "Nietsnut";
    $rangnr = 1;
} elseif ($rankp >= 10 && $rankp < 30) {
$r = 10;
    $rankv = 20;
$hoog = 0;
    $rang = "Hangjongere";
$rangnr = 2;
} elseif ($rankp >= 30 && $rankp < 60) {
    $r = 30;
$rankv = 30;
    $hoog = 0;
$rang = "Vandaal";
    $rangnr = 3;
} elseif ($rankp >= 60 && $rankp < 100) {
$r = 60;
    $rankv = 40;
$hoog = 0;
    $rang = "Jatter";
$rangnr = 4;
} elseif ($rankp >= 100 && $rankp < 250) {
    $r = 100;
$rankv = 150;
    $hoog = 0;
$rang = "Dief";
    $rangnr = 5;
} elseif ($rankp >= 250 && $rankp < 800) {
$r = 250;
    $rankv = 550;
$hoog = 0;
    $rang = "Autodief";
$rangnr = 6;
} elseif ($rankp >= 800 && $rankp < 1750) {
    $r = 800;
$rankv = 950;
    $hoog = 0;
$rang = "Drugsdealer";
    $rangnr = 7;
} elseif ($rankp >= 1750 && $rankp < 3000) {
$r = 1750;
    $rankv = 1250;
$hoog = 0;
    $rang = "Crimineel";
$rangnr = 8;
} elseif ($rankp >= 3000 && $rankp < 4500) {
    $r = 3000;
$rankv = 1500;
    $hoog = 0;
$rang = "Gangster";
    $rangnr = 9;
} elseif ($rankp >= 4500 && $rankp < 6500) {
$r = 4500;
    $rankv = 2000;
$hoog = 0;
    $rang = "Huurmoordenaar";
$rangnr = 10;
} elseif ($rankp >= 6500 && $rankp < 9000) {
    $r = 6500;
$rankv = 2500;
    $hoog = 0;
$rang = "Hitman";
    $rangnr = 11;
} elseif ($rankp >= 9000 && $rankp < 15000) {
$r = 9000;
    $rankv = 6000;
$hoog = 0;
    $rang = "Unlimited-Hitman";
$rangnr = 12;
} elseif ($rankp >= 15000 && $rankp < 25000) {
    $r = 15000;
$rankv = 10000;
    $hoog = 0;
$rang = "Godfather";
    $rangnr = 13;
} elseif ($rankp >= 25000 && $rankp < 40000) {
$r = 25000;
    $rankv = 15000;
$hoog = 0;
    $rang = "Super-Godfather";
$rangnr = 14;
} elseif ($rankp >= 40000 && $rankp < 60000) {
    $r = 40000;
$rankv = 20000;
    $hoog = 0;
$rang = "Unlimited-Godfather";
    $rangnr = 15;
} elseif ($rankp >= 60000 && $rankp < 90000) {
$r = 60000;
    $rankv = 30000;
$hoog = 0;
    $rang = "Don";
$rangnr = 16;
} elseif ($rankp >= 90000 && $rankp < 125000) {
    $r = 90000;
$rankv = 35000;
    $hoog = 0;
$rang = "Super-Don";
    $rangnr = 17;
} elseif ($rankp >= 125000 && $rankp < 200000) {
$r = 125000;
    $rankv = 75000;
$hoog = 0;
    $rang = "Ultra-Don";
$rangnr = 18;
} else {
    $r = 200000;
$rankv = 300000;
    $hoog = 1;
$rang = "Unlimited-Don";
    $rangnr = 19;
}

$a = ($rankp - $r) / $rankv;
$procenten = round(100 * $a);

return \$procenten;
}

function moordrang($strength, $return = "") {

$st = $strength;

if ($st < 10) { //10 ertussen
    $moordrang = "Ultra-slapjanus";
$moordrangnr = 1;
    $ertussen = 10;
$r = 0;
} elseif ($st >= 10 && $st < 30) { // 20 ertussen
    $moordrang = "Slapjanus";
$moordrangnr = 2;
    $ertussen = 20;
$r = 10;
} elseif ($st >= 30 && $st < 60) { // 30 ertussen
    $moordrang = "Vreselijke amateur";
$moordrangnr = 3;
    $ertussen = 30;
$r = 30;
} elseif ($st >= 60 && $st < 100) { // 40 ertussen
    $moordrang = "Amateur";
$moordrangnr = 4;
    $ertussen = 40;
$r = 60;
} elseif ($st >= 100 && $st < 150) { // 50 ertussen
    $moordrang = "Normaal";
$moordrangnr = 5;
    $ertussen = 50;
$r = 100;
} elseif ($st >= 150 && $st < 210) { // 60 ertussen
    $moordrang = "Judoka";
$moordrangnr = 6;
    $ertussen = 60;
$r = 150;
} elseif ($st >= 210 && $st < 280) { // 70 ertussen
    $moordrang = "Redelijk sterk";
$moordrangnr = 7;
    $ertussen = 70;
$r = 210;
} elseif ($st >= 280 && $st < 360) { // 80 ertussen
    $moordrang = "Bokser";
$moordrangnr = 8;
    $ertussen = 80;
$r = 280;
} elseif ($st >= 360 && $st < 450) { // 90 ertussen
    $moordrang = "Sterk";
$moordrangnr = 9;
    $ertussen = 90;
$r = 360;
} elseif ($st >= 450 && $st < 550) { // 100 ertussen
    $moordrang = "Kickbokser";
$moordrangnr = 10;
    $ertussen = 100;
$r = 450;
} elseif ($st >= 550 && $st < 660) { // 110 ertussen
    $moordrang = "Super sterk";
$moordrangnr = 11;
    $ertussen = 110;
$r = 550;
} elseif ($st >= 660 && $st < 780) { // 120 ertussen
    $moordrang = "Machtig";
$moordrangnr = 12;
    $ertussen = 120;
$r = 660;
} elseif ($st >= 780 && $st < 910) { // 130 ertussen
    $moordrang = "Erg Machtig";
$moordrangnr = 13;
    $ertussen = 130;
$r = 780;
} elseif ($st >= 910 && $st < 1050) { // 140 ertussen
    $moordrang = "Super machtig";
$moordrangnr = 14;
    $ertussen = 140;
$r = 910;
} elseif ($st >= 1050 && $st < 1250) { // 200 ertussen
    $moordrang = "Ultra deluxe machtig";
$moordrangnr = 15;
    $ertussen = 200;
$r = 1050;
} elseif ($st >= 1250 && $st < 1550) { // 300 ertussen
    $moordrang = "Onmenselijk sterk";
$moordrangnr = 16;
    $ertussen = 300;
$r = 1250;
} elseif ($st >= 1550 && $st < 2000) { // 450 ertussen
    $moordrang = "Robotachtig sterk";
$moordrangnr = 17;
    $ertussen = 480;
$r = 1550;
} elseif ($st >= 2000 && $st < 2600) { // 600 ertussen
    $moordrang = "Goddelijk";
$moordrangnr = 18;
    $ertussen = 600;
$r = 2000;
} elseif ($st >= 2600 && $st < 3800) { // 1200 ertussen
    $moordrang = "Erg goddelijk";
$moordrangnr = 19;
    $ertussen = 1200;
$r = 2600;
} elseif ($st >= 3800 && $st < 6200) { // 2400 ertussen
    $moordrang = "Super goddelijk";
$moordrangnr = 20;
    $ertussen = 2400;
$r = 3800;
} elseif ($st >= 6200 && $st < 10000) { // 3800 ertussen
    $moordrang = "Ultra deluxe goddelijk";
$moordrangnr = 21;
    $ertussen = 3800;
$r = 6200;
} elseif ($st >= 10000) { // ONEINDIG ERTUSSEN!
$moordrang = "King of the Gods (level " . $st . ")";
$moordrangnr = 22;
    $ertussen = 1;
$r = 10000;
} else { // ALS ER EEN ERRRORRR IS ..............
    $moordrang = "Error (level " . $st . ")";
    $moordrangnr = 1;
}

$a = ($st - $r) / $ertussen;
$procenten = round(100 * $a);
$procenten = ($procenten > 100) ? 100 : \$procenten;

if ($return == "") {
    return $moordrang;
} elseif ($return == "procent") {
    return $procenten;
} else {
return \$moordrangnr;
}
}
