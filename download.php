<?
	include("website/header.php");
	
	// make sure we have a version of the latest zip file on disk
	$basefilename = "jsGameSoup-v$revno.zip";
	$filename = "cache/" . $basefilename;
	if (!file_exists($filename)) {
		if (!is_dir("cache")) {
			mkdir("cache");
		}
		$ziplog = `zip -r '$filename' . --exclude .git`;
	}
?>
<h2>jsGameSoup - Download</h2>
<p><a href='<?= $filename; ?>'><?= $basefilename; ?></a></p>

<h2>Source code</h2>

<p><a href='https://github.com/chr15m/jsGameSoup'>Github page</a></p>

<p><a href='mailto:chris@mccormick.cx'>Patches welcome</a>!</p>

<? include("website/footer.php"); ?>
