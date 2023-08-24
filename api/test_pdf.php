<?php
require_once ('vendor/tecnickcom/tcpdf/tcpdf.php');
include 'class/PdfTest.php';

$test = new PdfTest();
$test->write();