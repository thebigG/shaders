#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    // ofDisableArbTex(); // Use if we need GL_TEXTURE_2D for our shader and want to use sampler2D instead of sampler2DRect
	if(ofIsGLProgrammableRenderer()){
		// shader.load("shadersGL3/shader");
	}else{
		shader.load("shadersGL2/wave_no_husukai");	
  }

//   img.load("/home/lgomez/Downloads/1343746.jpg"); // Load your image her
      if(!img.load("images/Hokusais_Wave.jpg")) {
        ofLogError() << "Image failed to load!";
    }
}

//--------------------------------------------------------------
void ofApp::update(){
	//
}

//--------------------------------------------------------------
void ofApp::draw(){
	ofSetColor(255);
	
	shader.begin();
	



    // shader.begin();
    //we want to pass in some varrying values to animate our type / color 
    shader.setUniform1f("u_time", ofGetElapsedTimef());
    // shader.setUniform1f("timeValY", -ofGetElapsedTimef() * 0.18 );
    
    //we also pass in the mouse position 
    //we have to transform the coords to what the shader is expecting which is 0,0 in the center and y axis flipped. 
    shader.setUniform2f("u_mouse", mouseX , mouseY );
    shader.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());
    shader.setUniformTexture("u_tex0", img.getTexture(), 0);
    cout << "w=" << img.getWidth() << " h=" << img.getHeight() << endl;
	// ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());
    img.draw(0, 0);
	
	shader.end();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if (key == 'q' && ofGetKeyPressed(OF_KEY_CONTROL)) {
        ofLog() << "CTRL+Q pressed. Quitting...";
        ofExit();
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
