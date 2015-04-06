using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Text;

public partial class hpu1 : System.Web.UI.Page
{
    string imageurl;
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Session["interface"].ToString().Equals("true"))
                Response.Redirect("~/interface1.aspx");
        }
        catch
        {
            Response.Redirect("~/interface1.aspx");
        }
        Random ran = new Random();
        int random = ran.Next(0, 169);
        carimage.ImageUrl = "~/arc6/CarData/TestImages/jpg/test-" + random.ToString() + ".jpg";
    }

    
    protected void delete(object sender, EventArgs e)
    {
        Pen blackPen = new Pen(Color.FromArgb(255, 0, 0, 0), 5);
        Rectangle r = new Rectangle(10,10,10,10);
        Rectangle r1 = new Rectangle(110, 110, 100, 100);
        if (r.Contains(r1))
            lbl.Text = "hello";
    }

    protected void Skip(object sender, EventArgs e)
    {
        try
        {
            Stopwatch sw = (Stopwatch)Session["timer"];
            sw.Stop();
            lbl.Visible = true;
            lbl.Text = sw.Elapsed.ToString();
        }
        catch
        {
        }
        Stopwatch sw1 = new Stopwatch();
        sw1.Start();
        Session["timer"] = sw1;
    }
}