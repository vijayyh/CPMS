const fs = require('fs');
const login = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');
const match = login.match(/<style>{`([\s\S]*?)`}<\/style>/);
if (match) {
  fs.writeFileSync('src/app/(auth)/auth.css', match[1]);
  let updatedLogin = login.replace(/<style>{`[\s\S]*?`}<\/style>/, '');
  updatedLogin = 'import "./auth.css";\n' + updatedLogin;
  fs.writeFileSync('src/app/(auth)/login/page.tsx', updatedLogin);
  
  let signup = fs.readFileSync('src/app/(auth)/signup/page.tsx', 'utf8');
  signup = 'import "../auth.css";\n' + signup;
  // Also add the footer to signup
  const footerStr = `
        <p className="login-footer">
          © 2024 CPMS · Construction Procurement & Management System
        </p>
      </div>
    </div>
  );
}`;
  signup = signup.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}/, footerStr);
  fs.writeFileSync('src/app/(auth)/signup/page.tsx', signup);
}
