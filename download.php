<?
	include("website/header.php");
	
	// make sure we have a version of the latest zip file on disk
	$basefilename = "jsGameSoup-v$revno.zip";
	$filename = "cache/" . $basefilename;
	if (!file_exists($filename)) {
		$ziplog = `zip -r '$filename' . --exclude .git`;
	}
?>
<h2>jsGameSoup - Download</h2>
<p><a href='<?= $filename; ?>'><?= $basefilename; ?></a></p>
<? include("website/footer.php"); ?>
